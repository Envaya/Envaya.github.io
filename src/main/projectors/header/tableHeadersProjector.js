/**
 * @module projectors/header/tableHeadersProjector
 *
 * Following the projector pattern, this module exports the projection function
 * {@link TableHeadersProjector} that create respective view and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 */

import {addListenersToColumnResizer, columnResizerElement, domElement} from "../../../util/util.mjs";

export { TableHeadersProjector };

/**
 * Creates table headers similar to <th> for each key that is found in the data entry object.
 * By clicking on a column, the sorting criteria on the respective column is set to empty (""), "asc" or "desc".
 * @param { !TableController } tableController
 * @param { !HTMLElement     } rootElement     - represents the top-level HTML Element. All other elements must be descendants of this element.
 */
const TableHeadersProjector = (tableController, rootElement) => {

    const tableHeader    = domElement("div", null, null, "table-header");
    const tableHeaderRow = domElement("div", null, null, "table-header-row");

    /**
     * Creates all tableHeaders.
     */
    const buildTableHeaders = () => {

        const existingTableHeaderElement = rootElement.querySelector('.table-header');

        if (null !== existingTableHeaderElement) {
            existingTableHeaderElement.querySelectorAll('*').forEach(n => n.remove());
        } else rootElement.appendChild(tableHeader);

        tableHeader.appendChild(tableHeaderRow);

        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++) {
            const tableHeaderCell           = domElement("div", null, null, "table-header-cell", `table-header-cell${columnIndex}`);
            const tableHeaderContentWrapper = domElement("div", null, null, "table-header-content-wrapper");
            const sortIcon                  = domElement("div", null, null, "sort-icon");

            tableHeaderCell.setAttribute('data-column-index', columnIndex.toString());
            tableHeaderCell.style.minWidth         = "50px";
            tableHeaderContentWrapper.style.cursor = "pointer";

            tableHeaderCell.appendChild(tableHeaderContentWrapper);
            tableHeaderCell.appendChild(sortIcon);
            tableHeaderRow .appendChild(tableHeaderCell);
        }

        const tableHeaders = rootElement.querySelectorAll('.table-header-cell');

        for (const [index, tableHeaderCol] of tableHeaders.entries()) {
            tableHeaderCol.querySelectorAll('.table-header-content-wrapper')[0].textContent = tableController.getEntryKeys()[index];
        }
        setTableHeaderGrid();
        initTableHeaderSortingListeners();
    }

    /**
     * Fills table headers with updated content.
     */
    const updateTableHeadersContent = () => {
        const tableHeaderCells = rootElement.querySelectorAll('[data-column-index]');

        for (const tableHeaderCell of tableHeaderCells){

            //reset all header cells
            tableHeaderCell.style.background = "";
            tableHeaderCell.querySelectorAll(".sort-icon")[0].classList.remove("sort-by-asc");
            tableHeaderCell.querySelectorAll(".sort-icon")[0].classList.remove("sort-by-desc");

            //set header selection visuals
            if( "" !== tableController.getFilter().ColumnSorter.state ){
                tableHeaderCells[tableController.getFilter().ColumnSorter.column].style.background = "lightsteelblue";
            }
            if( "desc" === tableController.getFilter().ColumnSorter.state ){
                tableHeaderCells[tableController.getFilter().ColumnSorter.column].querySelectorAll(".sort-icon")[0].classList.add("sort-by-desc");
            }
            if( "asc" === tableController.getFilter().ColumnSorter.state ){
                tableHeaderCells[tableController.getFilter().ColumnSorter.column].querySelectorAll(".sort-icon")[0].classList.add("sort-by-asc");
            }
        }
    }

    /**
     * Sorting listener.
     */
    const initTableHeaderSortingListeners = () => {
        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++){
            const tableHeaderCells = rootElement.querySelectorAll('[data-column-index]');

            tableHeaderCells[columnIndex].querySelectorAll('.table-header-content-wrapper')[0].addEventListener("click", _ => {

                if( "" === tableController.getFilter().ColumnSorter.state || "asc" === tableController.getFilter().ColumnSorter.state ) {
                    tableController.setColumnSorter(columnIndex, "desc");
                }
                else if( "desc" === tableController.getFilter().ColumnSorter.state &&  columnIndex !== tableController.getFilter().ColumnSorter.column ) {
                    tableController.setColumnSorter(columnIndex, "desc");
                }
                else if( "asc" === tableController.getFilter().ColumnSorter.state && columnIndex !== tableController.getFilter().ColumnSorter.column ) {
                    tableController.setColumnSorter(columnIndex, "desc");
                }
                else if( "desc" === tableController.getFilter().ColumnSorter.state) {
                    tableController.setColumnSorter(columnIndex, "asc");
                }
            });
        }
    }

    /**
     * setTableHeaderGrid
     */
    const setTableHeaderGrid = () => {

        const tableHeaderCells = tableHeaderRow ? tableHeaderRow.children : undefined;

        if (!tableHeaderCells) return;

        for (let columnIndex = 0; columnIndex < tableHeaderCells.length - 1; columnIndex++) {

            const columnResizer = columnResizerElement(tableHeaderCells[columnIndex].offsetHeight);
            tableHeaderCells[columnIndex].appendChild(columnResizer);
            addListenersToColumnResizer(tableController, rootElement, columnResizer);
        }
    }

    /**
     * Updates the columnWidths of the table header cells.
     */
    const updateHeaderColumnWidths = () => {
        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++){
            const tableHeaderCells = rootElement.getElementsByClassName(`table-header-cell${columnIndex}`);
            for (const tableHeaderCell of tableHeaderCells){
                tableHeaderCell.style.width    = tableController.getColumnWidths()[columnIndex];
                tableHeaderCell.style.maxWidth = tableController.getColumnWidths()[columnIndex];
            }
        }
    }
    tableController.onColumnWidthsChanged(() => {
        updateHeaderColumnWidths();
    });

    /**
     * Updates header content (icon, background) when filter changes.
     */
    tableController.onFilterChanged(() => {
        updateTableHeadersContent();
    });

    /**
     * Updates headers when EntryKeys changes.
     */
    tableController.onEntryKeysChanged(() => {
        buildTableHeaders();
        updateTableHeadersContent();
        updateHeaderColumnWidths();
    });
}