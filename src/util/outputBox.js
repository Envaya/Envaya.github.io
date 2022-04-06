import {domElement} from "./util.mjs";

export {outputBox};

/**
 * Displays values from table.
 * Component to test the mvc structure (passive).
 */
const outputBox = tableController => {

    const outPutContainer   = document.getElementById("output");
    const scrollIndexOutput = domElement("div",null,null);
    const rowsOutput        = domElement("div",null,null);

    outPutContainer.appendChild(scrollIndexOutput);
    outPutContainer.appendChild(rowsOutput);

    tableController.onScrollIndexChanged(() => {
        scrollIndexOutput.textContent = `
                 scrollTop:      ${tableController.getScrollTop()}
                 prefillHeight:  ${tableController.getPrefillHeight()}
                 scrollIndex:    ${tableController.getScrollIndex()}
                 nrOfVisibleRows ${tableController.get_NUMBER_OF_VISIBLE_ROWS()}
                 `;
    });
}