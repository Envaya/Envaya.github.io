/**
 * @module controller/tableController
 */

import { isEqual, PositiveNumber, pxMapper } from "../../util/util.mjs";

export { TableController };

/**
 * @typedef  { Object } TableController
 * @property { function(!Number, !Number)   : String }  getEntryValueByIndexAndKey
 * @property { function(!Number, !String)   : void   }  setColumnFilter
 * @property { function(!Number, !String)   : void   }  setColumnSorter
 * @property { function()                   : Number }  getRenderedRowsCount
 * @property { function(!Number, !Number)   : void   }  setColumnWidths
 * @property { function(!Number)            : void   }  scrollTopChangeHandler
 * @property { function(!Number)            : void   }  updateScrollIndex
 * @property { function()                   : void   }  init
 *
 * @property { function()                   : Object }  getFilter
 * @property { function()                   : Object }  getEntryKeys
 * @property { function()                   : Number }  getKeysLength
 *
 * @property { function(!Number)            : void   }  hasDataEntry
 * @property { function()                   : Number }  getTotalDataSize
 * @property { function(!Number)            : void   }  setTotalDataSize
 * @property { function()                   : Number }  getCurrentDataSetSize
 * @property { function(!Number)            : void   }  setCurrentDataSetSize
 *
 * @property { function()                   : Number }  getScrollIndex
 * @property { function()                   : Number }  getScrollTop
 * @property { function()                   : Number }  getColumnWidths
 *
 * @property { function()                   : Number }  getPrefillHeight
 * @property { function(!Number)            : void   }  setPrefillHeight
 * @property { function()                   : Number }  get_POSTFILL_INITIAL_HEIGHT
 * @property { function(!Number)            : void   }  set_POSTFILL_INITIAL_HEIGHT
 * @property { function()                   : Number }  getPostfillHeight
 * @property { function(!Number)            : void   }  setPostfillHeight
 * @property { function()                   : Number }  get_NUMBER_OF_RENDERED_ROWS
 * @property { function()                   : Number }  get_NUMBER_OF_VISIBLE_ROWS
 * @property { function(!Number)            : void   }  set_NUMBER_OF_VISIBLE_ROWS
 * @property { function()                   : Number }  getRowHeight
 * @property { function()                   : Number }  getViewPortHeight
 *
 * @property { function(callback: onValueChangeCallback<Object>)        : void }   onDataReset
 * @property { function(callback: onValueChangeCallback<Object>)        : void  }  onFilterChanged
 * @property { function(callback: onValueChangeCallback<Object>)        : void  }  onEntryKeysChanged
 * @property { function(callback: onValueChangeCallback<Object>)        : void  }  onDataChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void  }  onScrollIndexChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void  }  on_NUMBER_OF_VISIBLE_ROWS_Changed
 * @property { function(callback: onValueChangeCallback<Number>)        : void  }  onViewPortHeightChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void  }  onScrollTopChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void  }  on_NUMBER_OF_RENDERED_ROWS_Changed
 * @property { function(callback: onValueChangeCallback<Array<Number>>) : void  }  onColumnWidthsChanged
 */

/**
 * The TableController gives access to a {@link TablePresentationModel}.
 * @constructor
 * @param   { !TablePresentationModel } presentationModel
 * @param   { !TableService           } service
 * @returns { TableController }
 */
const TableController = (presentationModel, service) => {

    let   ignoreScrollEvent;
    let   currentScrollIndex;
    let   isInitialFilterChange = true;
    const dataInitListeners     = [];

    /**
     * Clears the data cached in the model when it exceeds the limit.
     */
    const cacheHandler = () => {
        if (presentationModel.getDataSize() > presentationModel.get_NUMBER_OF_RENDERED_ROWS() + 100) {
            presentationModel.clearData();
        }
    }

    /**
     * Fetches a data batch from the service, starting from the current scroll index and matching the current filter.
     * Updates the data size of the batch as well as the total data size based on the response.
     * Resets the entries in the model with the new data.
     */
    const getFilteredData = () => {
        const startIndex = presentationModel.getScrollIndex();
        const endIndex   = startIndex + 3 * presentationModel.get_NUMBER_OF_RENDERED_ROWS();
        service.getDataWithFilter(presentationModel.getFilter(), startIndex, endIndex)
            .then(promises => {
                const batchData          = promises[0];
                const currentDataSetSize = promises[1];
                const totalDataSize      = promises[2];

                presentationModel.setTotalDataSize(totalDataSize);
                presentationModel.setCurrentDataSetSize(currentDataSetSize);

                if (batchData.length > 0) {
                    if (!isEqual(Object.keys(batchData[0]), presentationModel.getEntryKeys())) presentationModel.setEntryKeys(Object.keys(batchData[0]));
                }

                presentationModel.initData(presentationModel.getScrollIndex(), batchData);
            })
            .catch(e => console.error(`The following error occurred while updating table data: ${e.message}`));
    }

    /**
     * Checks for all currently rendered rows whether the model contains the according data entry.
     * If not, the method fetches the respective entries from the service individually.
     */
    const updateData = () => {
        cacheHandler();
        const INDEX_OF_BOTTOM_MOST_RENDERED_ROW = presentationModel.getScrollIndex() + presentationModel.get_NUMBER_OF_RENDERED_ROWS();
        for(let renderedRowIndex = presentationModel.getScrollIndex();
            renderedRowIndex < INDEX_OF_BOTTOM_MOST_RENDERED_ROW; renderedRowIndex++) {
                if (!presentationModel.hasEntry(renderedRowIndex) && renderedRowIndex < presentationModel.getCurrentDataSetSize()) {
                    service.getSingleDataEntry(presentationModel.getFilter(), renderedRowIndex)
                        .then(data => presentationModel.setDataEntry(renderedRowIndex, data))
                        .catch(e => console.error(`The following error occurred while updating the data of a table row: ${e.message}`));
                }
        }
    }

    /**
     * Requests data from the service matching a new filter
     */
    presentationModel.onFilterChanged(() => {
        if (!isInitialFilterChange) getFilteredData();
        isInitialFilterChange = false;
    });

    /**
     * Returns one value of a single entry.
     * @param { !Number } scrollIndex   - Index of current entry;    mandatory.
     * @param { !Number } columnIndex - Index of current column;   mandatory.
     * @example
     * "Hans Muster"
     */
    const getEntryValueByIndexAndKey = (scrollIndex, columnIndex) => {
        try {
            if(columnIndex < 0 || columnIndex > presentationModel.getEntryKeys().length || isNaN(columnIndex)){
                return "";
            }
            const key = presentationModel.getEntryKeys()[columnIndex];

            if (presentationModel.hasEntry(scrollIndex)) {
                return presentationModel.getSingleDataEntry(scrollIndex)[key];
            }
            return "";

        } catch (e) {
            console.warn(`Error in getEntryValueByIndexAndKey: ${e}`);
            return "";
        }
    }

    /**
     * Updates filter Obs with current filters.
     * @param { !Number } columnIndex - Index of current column; mandatory.
     * @param { !String } queryValue  - InputValue by the user;  mandatory.
     */
    const setColumnFilter = (columnIndex, queryValue) => {

        const newFilterObject = { ...presentationModel.getFilter() }; //create shallow copy to trigger onFilterChanged()

        if (columnIndex < 0 || columnIndex >= presentationModel.getEntryKeys().length) {
            console.warn(`received invalid columnIndex in setColumnFilter: ${columnIndex} -> filter does not change instead`);
            return;
        } else {
            newFilterObject.ColumnFilters[columnIndex] = queryValue.toString().toLowerCase();
        }

        presentationModel.setFilter(newFilterObject);
    }

    /**
     * Updates filter Obs with current sorting state.
     * @param { !Number } columnIndex - Index of current column;                   mandatory.
     * @param { !String } state       - Current state of column ('asc'|'desc'|''); mandatory.
     */
    const setColumnSorter = (columnIndex, state) => {

        const newFilterObject = { ...presentationModel.getFilter() }; //create shallow copy to trigger onFilterChanged()

        if (columnIndex < 0 || columnIndex >= presentationModel.getEntryKeys().length) {
            console.warn(`received invalid columnIndex in setColumnSorter: ${columnIndex} -> was instead set to 0`);
            newFilterObject.ColumnSorter.column = 0;
        } else {
            newFilterObject.ColumnSorter.column = columnIndex;
        }

        if ("desc" !== state && "asc" !== state) {
            console.warn(`received invalid state in setColumnSorter: ${state} -> was instead set to ""`);
            newFilterObject.ColumnSorter.state = "";
        } else {
            newFilterObject.ColumnSorter.state = state;
        }

        presentationModel.setFilter(newFilterObject);
    }

    /**
     * Returns the number of rows, which need to be filled with data.
     * @returns { Number }
     */
    const getRenderedRowsCount = () => {
        if (presentationModel.getDataSize() < presentationModel.get_NUMBER_OF_VISIBLE_ROWS()){
            return presentationModel.getDataSize();
        } else {
            return presentationModel.get_NUMBER_OF_VISIBLE_ROWS();
        }
    }

    /**
     * Updates number of rendered rows based on current dataSet size.
     */
    const set_NUMBER_OF_RENDERED_ROWS = () =>
        presentationModel.set_NUMBER_OF_RENDERED_ROWS(presentationModel.get_NUMBER_OF_VISIBLE_ROWS()
            + (presentationModel.getCurrentDataSetSize() <= presentationModel.get_NUMBER_OF_VISIBLE_ROWS()
                ? 0
                : 1 ));

    /**
     * Sets the width of target column and adjusts the column to the right.
     * @param { !Number } columnIndex - Index of target column; mandatory.
     * @param { !Number } columnWidth - Width of target column; mandatory.
     */
    const setColumnWidths = (columnIndex, columnWidth) => {
        const newColumnWidths            = [ ...presentationModel.getColumnWidths() ];
        newColumnWidths[columnIndex]     = columnWidth;
        newColumnWidths[columnIndex + 1] = presentationModel.getColumnWidths()[columnIndex + 1] +
            (presentationModel.getColumnWidths()[columnIndex] - columnWidth);

        presentationModel.setColumnWidths(newColumnWidths);
    }

    /**
     * Scroll event handler.
     * @param { !Number } scrollTop - New scrollTop, provided by the tableBody; mandatory.
     */
    const scrollTopChangeHandler = scrollTop => {
        const scrollTopLimit = presentationModel.getCurrentDataSetSize() * presentationModel.getRowHeight() -
            presentationModel.get_NUMBER_OF_RENDERED_ROWS() * presentationModel.getRowHeight();
        scrollTop = scrollTop > scrollTopLimit ? scrollTopLimit : scrollTop;
        presentationModel.setScrollTop(scrollTop);
        /**
         * assert that our use of scrollTo does not trigger our own scroll handler again.
         */
        if (ignoreScrollEvent) {
            return;
        }
        ignoreScrollEvent = true;

            /**
             * Calculate the scrollIndex based on the current scroll position.
             * Cache the value locally to make sure it does not change while processing.
             * @example
             * (scrollIndex) 3 = (scrollTop) 180 / (rowHeight) 60
             */
            const scrollIndex = Math.floor(scrollTop / presentationModel.getRowHeight());

            /**
             * Skip updating the view if we haven't scrolled a full row height.
             */
            if (scrollIndex === currentScrollIndex) {
                ignoreScrollEvent = false;
                return;
            }

            currentScrollIndex = scrollIndex;

            updateScrollIndex(scrollIndex);

            ignoreScrollEvent = false;
    }

    /**
     * Error Handling of invalid scrollIndex.
     * @param { !Number } index - Given scrollIndex to check if it's a valid value; mandatory;
     * @returns { Number }
     */
    const handleInvalidScrollIndex = index => {

        /**
         * ScrollIndex is a Double Value
         */
        if (index % 1 !== 0) {
            console.warn("invalid ScrollIndex: " + index);
            index = Math.round(index);
        }

        /**
         * ScrollIndex < 0 || ScrollIndex != Number
         */
        if (index < 0 || isNaN(index)) {
            console.warn("invalid ScrollIndex: " + presentationModel.getScrollIndex());
            index = 0;
        }

        if (presentationModel.getCurrentDataSetSize() > 0) {
            /**
             * ScrollIndex > entries.length
             */
            if (index >= presentationModel.getCurrentDataSetSize()) {
                console.warn("invalid ScrollIndex: " + index);
                index = 0;
            }
        }
        return index;
    }

    /**
     * Sets new ScrollIndex and updates data based on it.
     * @param { !Number  } index             - Index of current position.
     * @param { ?Boolean } isExternalChange  - Check if change happens somewhere other than the tableBody.
     */
    const updateScrollIndex = (index, isExternalChange = false) => {
        index = handleInvalidScrollIndex(index);

        /**
         * Set new ScrollTop when ScrollIndex changes from other than scrolling
         * i.e.: InputBox Button "Scroll to ScrollIndex 42"
         */
        if (isExternalChange) {
            const newScrollTop = Math.floor(index * presentationModel.getRowHeight());
            presentationModel.setScrollTop(newScrollTop);
        }

        /**
         * update pre- and postfill heights.
         */
        const newPrefillHeight  = index * presentationModel.getRowHeight();
        const newPostfillHeight = presentationModel.get_POSTFILL_INITIAL_HEIGHT() - newPrefillHeight;
        presentationModel.setPrefillHeight(newPrefillHeight);
        presentationModel.setPostfillHeight(PositiveNumber(newPostfillHeight));

        presentationModel.setScrollIndex(index);
        updateData();
    }

    /**
     * Render one more row that there is space in the viewport
     */
    presentationModel.on_NUMBER_OF_VISIBLE_ROWS_Changed(_ => {
        presentationModel.setViewPortHeight(presentationModel.get_NUMBER_OF_VISIBLE_ROWS() * presentationModel.getRowHeight());
    });

    /**
     * Handling postfill size.
     */
    const resetPostFillSize = () => {
        presentationModel.setPrefillHeight(0);
        presentationModel.set_POSTFILL_INITIAL_HEIGHT(
            PositiveNumber(presentationModel.getRowHeight() * presentationModel.getCurrentDataSetSize() -
                                presentationModel.getRowHeight() * presentationModel.get_NUMBER_OF_RENDERED_ROWS())
        );
        presentationModel.setPostfillHeight(presentationModel.get_POSTFILL_INITIAL_HEIGHT());
    }

    /**
     * Handles all actions necessary after initialization of the data in the model.
     */
    presentationModel.onDataInit(_ => {
        handleInvalidScrollIndex(presentationModel.getScrollIndex());
        set_NUMBER_OF_RENDERED_ROWS();
        resetPostFillSize();
        dataInitListeners.forEach(listener => listener(presentationModel.getPostfillHeight()));
    });

    /**
     * Listener for data reset.
     * @param  { !Function } listener
     */
    const onDataReset = listener => {
        dataInitListeners.push(listener);
    }

    /**
     * Fetch initial set of data
     */
    const init = () => {
        getFilteredData();
    }

    return {
        getEntryValueByIndexAndKey,
        setColumnFilter,
        setColumnSorter,
        getRenderedRowsCount,
        setColumnWidths,
        scrollTopChangeHandler,
        updateScrollIndex:             index => updateScrollIndex(index, true),
        onDataReset,
        init,

        getFilter:                     ()    => presentationModel.getFilter(),
        getEntryKeys:                  ()    => presentationModel.getEntryKeys(),
        getKeysLength:                 ()    => presentationModel.getEntryKeys().length,

        hasDataEntry:                  value => presentationModel.hasDataEntry(value),
        getTotalDataSize:              ()    => presentationModel.getTotalDataSize(),
        setTotalDataSize:              value => presentationModel.setTotalDataSize(value),
        getCurrentDataSetSize:         ()    => presentationModel.getCurrentDataSetSize(),
        setCurrentDataSetSize:         value => presentationModel.setCurrentDataSetSize(value),

        getScrollIndex:                ()    => presentationModel.getScrollIndex(),
        getScrollTop:                  ()    => presentationModel.getScrollTop(),
        getColumnWidths:               ()    => pxMapper(presentationModel.getColumnWidths()),

        getPrefillHeight:              ()    => presentationModel.getPrefillHeight(),
        setPrefillHeight:              value => presentationModel.setPrefillHeight(value),
        get_POSTFILL_INITIAL_HEIGHT:   ()    => presentationModel.get_POSTFILL_INITIAL_HEIGHT(),
        set_POSTFILL_INITIAL_HEIGHT:   value => presentationModel.set_POSTFILL_INITIAL_HEIGHT(value),
        getPostfillHeight:             ()    => presentationModel.getPostfillHeight(),
        setPostfillHeight:             value => presentationModel.setPostfillHeight(value),
        get_NUMBER_OF_RENDERED_ROWS:   ()    => presentationModel.get_NUMBER_OF_RENDERED_ROWS(),
        get_NUMBER_OF_VISIBLE_ROWS:    ()    => presentationModel.get_NUMBER_OF_VISIBLE_ROWS(),
        set_NUMBER_OF_VISIBLE_ROWS:    value => presentationModel.set_NUMBER_OF_VISIBLE_ROWS(value),
        getRowHeight:                  ()    => presentationModel.getRowHeight(),
        getViewPortHeight:             ()    => presentationModel.getViewPortHeight(),

        onFilterChanged:                        presentationModel.onFilterChanged,
        onEntryKeysChanged:                     presentationModel.onEntryKeysChanged,
        onDataChanged:                          presentationModel.onDataChanged,
        onScrollIndexChanged:                   presentationModel.onScrollIndexChanged,
        on_NUMBER_OF_RENDERED_ROWS_Changed:     presentationModel.on_NUMBER_OF_RENDERED_ROWS_Changed,
        onViewPortHeightChanged:                presentationModel.onViewPortHeightChanged,
        onScrollTopChanged:                     presentationModel.onScrollTopChanged,
        on_NUMBER_OF_VISIBLE_ROWS_Changed:      presentationModel.on_NUMBER_OF_VISIBLE_ROWS_Changed,
        onColumnWidthsChanged:                  presentationModel.onColumnWidthsChanged
    }
}