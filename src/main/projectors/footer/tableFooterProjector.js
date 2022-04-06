/**
 * @module projectors/footer/tableFooterProjector
 *
 * Following the projector pattern, this module exports the projection function
 * {@link TableFooterProjector} that create respective view and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 */

import {addThousandsSeparator, domElement} from "../../../util/util.mjs";

export { TableFooterProjector };

/**
 * Displays current ScrollIndex, currentDatSetSize and totalDataSize.
 * @param { !TableController } tableController
 * @param { !HTMLElement     } rootElement     - represents the top-level HTML Element. All other elements must be descendants of this element.
 */
const TableFooterProjector = (tableController, rootElement) => {

    const footer         = domElement("div", null, "table-footer");
    const entriesDisplay = domElement("div", null, "entries-display");

    rootElement.appendChild(footer);
    footer     .appendChild(entriesDisplay);

    /**
     * Fills table footer with updated content.
     */
    const updateTableFooterContent = () => {

        if (tableController.getCurrentDataSetSize() <= 0){
            entriesDisplay.textContent = "( no entries found )";
        } else {
            entriesDisplay.textContent = `( 
                ${addThousandsSeparator(tableController.getScrollIndex() + 1 )} - 
                ${addThousandsSeparator(tableController.getScrollIndex() + (0 === tableController.getScrollIndex() ? tableController.getRenderedRowsCount() : tableController.getRenderedRowsCount() + 1))} / 
                ${addThousandsSeparator(tableController.getCurrentDataSetSize())}
                
            ) --- Total data size: ${addThousandsSeparator(tableController.getTotalDataSize())}`;
        }
    }

    /**
     * All listeners relevant for Table Footer.
     */
    const tableFooterListeners = () => {
        /**
         * Updates table footer content based on current ScrollIndex.
         */
        tableController.onScrollIndexChanged(() => {
            updateTableFooterContent();
        });

        /**
         * Updates table footer content when data changes.
         */
        tableController.onDataReset(() => {
            updateTableFooterContent();
        });
    }

    //init call
    updateTableFooterContent();
    tableFooterListeners();
}