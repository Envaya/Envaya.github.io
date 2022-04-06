
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

    scrollToScrollIndexButton.textContent = "Scroll to ScrollIndex 42";
    filterTestInputField.placeholder      = "Filter by name";
    sortButton.textContent                = "Sort column 3 asc";
    colWidthChanger.placeholder           = "Change ColWidth of Col1";

    inputBoxContainer.appendChild(scrollToScrollIndexButton);
    inputBoxContainer.appendChild(filterTestInputField);
    inputBoxContainer.appendChild(sortButton);
    inputBoxContainer.appendChild(colWidthChanger);

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
}
