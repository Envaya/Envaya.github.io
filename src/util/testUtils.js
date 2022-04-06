import {Observable}   from "../../kolibri/observable.js";
import {localEntries} from "../../example_implementations/repositories/localRepository.js";
import {tableConfig}  from "../main/config.js";

export {getTableConfig, stubModel, noService}

/**
 * Stub: tableConfig Object
 */
const getTableConfig = () => (
    {
        app: {
            rowHeight: 60,
            nrVisibleRows: 8,
            filterObj: {
                ColumnFilters: ['', '', '', '', '', ''],
                ColumnSorter:
                    {
                        column: undefined,
                        state:  ''
                    }
            },
            columnWidths: [100, 240, 350, 350, 240, 240]
        },
        testing: {
            SIMULATED_FETCH_DELAY: 150,
        }
    }
);

/**
 * Stub Model. Only for testing.
 */
const stubModel = () => {
    const filter    = Observable( getTableConfig().app.filterObj);
    const entryKeys = ['id', 'name', 'email', 'address', 'region', 'country'];
    let data = localEntries;

    return {
        getFilter:          filter.getValue,
        setFilter:          filter.setValue,
        onFilterChanged:    _ => _,
        getScrollIndex:     _ => _,

        setData:            value => data = value,
        getData:            _ => data,
        initData:           _ => _,
        getSingleDataEntry: _ => _,
        setDataEntry:       _ => _,
        deleteDataEntry:    _ => _,
        hasDataEntry:       _ => _,
        getDataSize:        _ => data.length,
        onDataInit:         _ => _,
        onDataChanged:      _ => _,
        hasEntry:           _ => _,

        set_POSTFILL_INITIAL_HEIGHT:     _ => _,
        get_POSTFILL_INITIAL_HEIGHT:     _ => _,

        setScrollIndex:               _ => _,
        onScrollIndexChanged:         _ => _,

        getScrollTop:                 _ => _,
        setScrollTop:                 _ => _,
        onScrollTopChanged:           _ => _,

        getPrefillHeight:             _ => _,
        setPrefillHeight:             _ => _,
        onPrefillHeightChanged:       _ => _,

        getPostfillHeight:            _ => _,
        setPostfillHeight:            _ => _,
        onPostfillHeightChanged:      _ => _,

        getViewPortHeight:            _ => _,
        setViewPortHeight:            _ => _,
        onViewPortHeightChanged:      _ => _,

        getRowHeight:                 _ => _,
        setRowHeight:                 _ => _,
        onRowHeightChanged:           _ => _,

        get_NUMBER_OF_RENDERED_ROWS:          _ => _,
        set_NUMBER_OF_RENDERED_ROWS:          _ => _,
        on_NUMBER_OF_RENDERED_ROWS_Changed:   _ => _,

        get_NUMBER_OF_VISIBLE_ROWS:        _ => 8,
        set_NUMBER_OF_VISIBLE_ROWS:        _ => _,
        on_NUMBER_OF_VISIBLE_ROWS_Changed: _ => _,

        setTotalDataSize:             _ => _,
        getTotalDataSize:             _ => _,

        getColumnWidths:              _ => _,
        setColumnWidths:              _ => _,
        onColumnWidthsChanged:        _ => _,

        getEntryKeys:                 () => entryKeys,
        setEntryKeys:                 _ => _,
        onEntryKeysChanged:           _ => _
    };
};

/**
 * Stub: service with no dataset
 * Concrete factory for local {@link TableService} functions.
 * @constructor
 * @returns { TableService }
 */
const noService = () => {
    const SIMULATED_FETCH_DELAY = tableConfig.testing.SIMULATED_FETCH_DELAY;

    /**
     * Fetch x entries fulfilling a filter from a local repository.
     * @param {Filter} filter
     * @return
     */
    const applyFilter = (filter) => {
        let entriesProxy = [];

        /**
         * Filtering.
         */
        for (const [index, columnFilter] of filter.ColumnFilters.entries()) {
            if (columnFilter)  {
                entriesProxy = entriesProxy.filter(entry => entry[Object.keys(entry)[index]].toString().toLowerCase().includes(columnFilter));
            }
        }

        /**
         * Sorting.
         */
        if ( "desc" === filter.ColumnSorter.state ) {
            entriesProxy.sort((a, b) => a[Object.keys(a)[filter.ColumnSorter.column]] > b[Object.keys(b)[filter.ColumnSorter.column]] ? 1 : -1);
        } else if ( "asc" === filter.ColumnSorter.state ) {
            entriesProxy.sort((a, b) => a[Object.keys(a)[filter.ColumnSorter.column]] < b[Object.keys(b)[filter.ColumnSorter.column]] ? 1 : -1);
        }

        return entriesProxy;
    }

    /**
     * Fetches an array of  data entries.
     * Applies the received filter to the data set and returns the entries
     * ranging from startIndex to endIndex from that filtered subset.
     * The 2nd return value is length of the filtered subset.
     * The 3rd return value is the length of the original, unfiltered data.
     * All 3 values must be returned as an Array of promises.
     * @param {!Filter} filter
     * @param {!Number} startIndex
     * @param {!Number} endIndex
     * @returns {Promise<unknown[]>}
     */
    const getDataWithFilter = (filter, startIndex, endIndex) => {
        let totalData;
        const filteredData = applyFilter(filter);
        const filteredDataSubset = (filteredData.length < endIndex + 1) ? filteredData : filteredData.slice(startIndex, endIndex);

        const filteredDataSubsetPromise     = new Promise((resolve) => setTimeout(() => resolve(filteredDataSubset),  SIMULATED_FETCH_DELAY));
        const filteredDataSubsetSizePromise = new Promise((resolve) => setTimeout(() => resolve(filteredData.length), SIMULATED_FETCH_DELAY));
        const totalDataSizePromise          = new Promise((resolve) => setTimeout(() => resolve(totalData.length),    SIMULATED_FETCH_DELAY));

        return Promise.all([filteredDataSubsetPromise, filteredDataSubsetSizePromise, totalDataSizePromise]);
    }

    /**
     * Fetches a single data entry.
     * Applies the received filter to the data set and returns the entry
     * with the given index from that filtered subset.
     * @param {?Filter} filter
     * @param {!Number} index
     * @return {Promise<Entry>}
     */
    const getSingleDataEntry = (filter, index) =>
        new Promise((resolve) => setTimeout(() => resolve(applyFilter(filter)[index]), SIMULATED_FETCH_DELAY));

    return {
        getDataWithFilter,
        getSingleDataEntry
    }
}