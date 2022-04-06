/**
 * @module projectors/body/tableBodyProjector
 *
 * Following the projector pattern, this module exports the projection function
 * {@link TableBodyProjector} that create respective view and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 */

import { domElement } from "../../../util/util.mjs";

export { TableBodyProjector };

/**
 * TableBody is the main view and must be implemented.
 * Creates a table body element with n table rows, where n is the number of rows specified at nrVisibleRows in the TableConfig.
 * Depending on the specified rowHeight, the table can currently supports about 250'000 data entries.
 * @param { !TableController} tableController
 * @param { !HTMLElement    } rootElement     - represents the top-level HTML Element. All other elements must be descendants of this element.
 */
const TableBodyProjector = (tableController, rootElement) => {

    const tableBody = domElement("div",null, null, "table-body");
    const prefill   = domElement("div",null, 'prefill');
    const postfill  = domElement("div", {height: tableController.getPostfillHeight() + 'px'}, "postfill");
    const tableRowList = [];

    /**
     * Creates table Body.
     */
    const buildTableBody = () => {
        rootElement.classList.add('big-lazy-table-container');
        const existingTableBodyElement = rootElement.querySelector('.table-body');

        if (null !== existingTableBodyElement) {
            while (existingTableBodyElement.firstChild) {
                existingTableBodyElement.removeChild(existingTableBodyElement.firstChild);
            }
        } else rootElement.appendChild(tableBody);

        tableBody.appendChild(prefill);

        const tableBodyFragment = document.createDocumentFragment();

        const generateRows = () => {
            for (let rowIndex = 0; rowIndex < tableController.get_NUMBER_OF_RENDERED_ROWS(); rowIndex++) {

                const row = domElement("div", {overflow: "hidden"}, null, `table-row${rowIndex}`, "table-row");

                for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++) {
                    const cell = domElement("div", {height: tableController.getRowHeight() + 'px'}, null, "table-cell", `cell${rowIndex}${columnIndex}`)
                    row.appendChild(cell);
                    cell.style.minWidth = "50px";
                }

                tableBodyFragment.appendChild(row);
                tableRowList.push(row);
            }
            tableBody.appendChild(tableBodyFragment);
        }
        generateRows();

        tableBody.appendChild(postfill);

        updateTableBodyColumnWidths();
    }

    /**
     * Handler for visible rows count change.
     */
    tableController.on_NUMBER_OF_RENDERED_ROWS_Changed(() => {
        // update last scroll index
        // wait for service to return new data
        // increase viewport by (number of added rows) * rowHeight
        // create row elements and add them to rows[]
        tableRowList.forEach(row => {
            row.style.height = tableController.getRowHeight() + 'px';
        });
        tableBody.style.height = tableController.getViewPortHeight() + 'px';
    });

    /**
     * Redraws the view of everything related to the Scroller Viewport.
     */
    const updateScrollPosition = () => {
        updateTableFillSizes();
        tableBody.scrollTo({top: tableController.getScrollTop()});
    }

    /**
     * Scrolls to the Top of the Table.
     */
    const scrollToTop = () => {
        const tableBody = rootElement.querySelector(".table-body");

        tableBody.scrollTo({
            top: 0
        });
    }

    /**
     * Fills table Body with updated content.
     */
    const updateTableBodyContent = () => {
        for (let rowIndex = 0; rowIndex < tableController.get_NUMBER_OF_RENDERED_ROWS(); rowIndex++){
            updateSingleRowContent(rowIndex);
        }
    }

    const updateSingleRowContent = rowIndex => {
        const dataIndex     = tableController.getScrollIndex() + rowIndex;
        const rowEle        = tableBody.getElementsByClassName(`table-row${rowIndex}`)[0];
        const dataAvailable = tableController.hasDataEntry(dataIndex);

        if (dataIndex < tableController.getCurrentDataSetSize()) {
            if (dataAvailable) {
                rowEle.classList.remove("loading");
            } else {
                rowEle.classList.add("loading");
            }
        }

        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++) {

            const cells = rootElement.getElementsByClassName(`cell${rowIndex}${columnIndex}`);

            for (let cell of cells) {
                cell.textContent = tableController.getEntryValueByIndexAndKey(tableController.getScrollIndex() + rowIndex, columnIndex);
            }
        }
    }

    const updateTableFillSizes = () => {
        prefill .style.height = tableController.getPrefillHeight() + "px";
        postfill.style.height = tableController.getPostfillHeight() + "px";
    }

    const updateTableBodyColumnWidths = () => {
        for (let rowIndex = 0; rowIndex < tableController.get_NUMBER_OF_RENDERED_ROWS(); rowIndex++){
            for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++){
                const cells = rootElement.getElementsByClassName(`cell${rowIndex}${columnIndex}`);
                for (let cell of cells){
                    cell.style.width    = tableController.getColumnWidths()[columnIndex];
                    cell.style.maxWidth = tableController.getColumnWidths()[columnIndex];
                }
            }
        }
    }

    /**
     * All listeners relevant for Table Body.
     */
    const tableBodyListeners = () => {

        /**
         * Scroll Listener.
         */
        tableBody.addEventListener("scroll", _ => {
            tableController.scrollTopChangeHandler(tableBody.scrollTop);
        });

        /**
         * Updates table column widths.
         */
        tableController.onColumnWidthsChanged(() => {
            updateTableBodyColumnWidths();
        });

        /**
         * Updates table scroll position and content based on current ScrollIndex.
         */
        tableController.onScrollIndexChanged(() => {
            updateScrollPosition();
            updateTableBodyContent();
        });

        /**
         * Updates table-body content and properties when table data is reset.
         */
        tableController.onDataReset(() => {
            buildTableBody();
            updateTableFillSizes();
            scrollToTop();
            updateTableBodyContent();
        });

        /**
         * Updates table-body when data changes.
         */
        tableController.onDataChanged((dataIndex, _) => {
            const rowIndex = dataIndex - tableController.getScrollIndex();
            if (rowIndex >= 0 && rowIndex <= tableController.get_NUMBER_OF_RENDERED_ROWS() - 1) updateSingleRowContent(rowIndex);
        });
    }

    buildTableBody();
    tableBodyListeners();
}