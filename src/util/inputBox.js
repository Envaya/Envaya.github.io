import {TableHeadersProjector}  from "../main/projectors/header/tableHeadersProjector.js";
import {FiltersProjector}       from "../main/projectors/header/filtersProjector.js";
import {TableBodyProjector}     from "../main/projectors/body/tableBodyProjector.js";
import {TableFooterProjector}   from "../main/projectors/footer/tableFooterProjector.js";
import {TablePresentationModel} from "../main/model/tablePresentationModel.js";
import {getTableConfig}         from "../../example_implementations/randomAsyncData/asyncRandomConfig.js";
import {TableController}        from "../main/controller/tableController.js";
import {asyncRandomService}     from "../../example_implementations/randomAsyncData/asyncRandomService.js";

export { inputBox }

/**
 * Component to test the mvc structure (active).
 */
const inputBox = mainController => {

    //View
    const inputBoxContainer = document.getElementById("input-box");

    const scrollToScrollIndexButton = document.createElement("button");
    const filterTestInputField      = document.createElement("input");
    const sortButton                = document.createElement("button");
    const colWidthChanger           = document.createElement("input");
    const addTableButton            = document.createElement("button");
    const deleteTableButton         = document.createElement("button");

    scrollToScrollIndexButton.textContent = "Scroll to ScrollIndex 42";
    filterTestInputField.placeholder      = "Filter by name";
    sortButton.textContent                = "Sort column 3 asc";
    colWidthChanger.placeholder           = "Change ColWidth of Col1";
    addTableButton.textContent            = "Add Table";
    deleteTableButton.textContent         = "Delete Table";

    inputBoxContainer.appendChild(scrollToScrollIndexButton);
    inputBoxContainer.appendChild(filterTestInputField);
    inputBoxContainer.appendChild(sortButton);
    inputBoxContainer.appendChild(colWidthChanger);
    inputBoxContainer.appendChild(addTableButton);
    inputBoxContainer.appendChild(deleteTableButton);

    scrollToScrollIndexButton.onclick = () => {
        mainController.updateScrollIndex(42);
    }

    filterTestInputField.addEventListener("keyup", _ => {
        mainController.setColumnFilter(1, filterTestInputField.value);
    });

    sortButton.onclick = () => {
        mainController.setColumnSorter(3, "asc");
    }
    
    colWidthChanger.addEventListener("keyup", _ => {
        mainController.setColumnWidths(1, colWidthChanger.value);
    });

    addTableButton.onclick = () => {

        const services          = asyncRandomService(1000);
        const presentationModel = TablePresentationModel(getTableConfig());
        const tableController   = TableController(presentationModel, services);
        tableController.init();

        const container   = document.getElementById('added-tables-container');
        const rootElement = document.createElement("div");
        container.appendChild(rootElement);
        TableHeadersProjector(tableController, rootElement);
        FiltersProjector     (tableController, rootElement);
        TableBodyProjector   (tableController, rootElement);
        TableFooterProjector (tableController, rootElement);
    }

    deleteTableButton.onclick = () => {
        const container   = document.getElementById('added-tables-container');
        container.removeChild(container.lastChild);
    }
}
