import {asyncTest, TestSuite}      from "../../../kolibri/util/test.js";
import {TableController}           from "./tableController.js";
import {localTestService}               from "../service/localTestService.js";
import {TablePresentationModel}    from "../model/tablePresentationModel.js";
import {sleep}                     from "../../util/util.mjs";
import {getTableConfig, stubModel} from "../../util/testUtils.js";
import {tableConfig}               from "../config.js";

const tableControllerSuite = TestSuite("tableController");

/**
 * Unit Test: setColumnFilter & setColumnSorter.
 */
tableControllerSuite.add("filter-object-management", assert => {

    //given
    const service         = localTestService();
    const model           = stubModel();
    const tableController = TableController(model, service); //warning can be ignored, because it's a stub model with no interface

    //when
    tableController.setColumnFilter(1, "John");

    //then
    assert.is(model.getFilter().ColumnFilters[1], "john");

    //when
    tableController.setColumnSorter(1, "asc");

    //then
    assert.is(model.getFilter().ColumnSorter.column,1);
    assert.is(model.getFilter().ColumnSorter.state, "asc");

    //when
    tableController.setColumnFilter(5, "United");

    //then
    assert.is(model.getFilter().ColumnFilters[1],   "john");
    assert.is(model.getFilter().ColumnFilters[5],   "united");
    assert.is(model.getFilter().ColumnSorter.column,1);
    assert.is(model.getFilter().ColumnSorter.state, "asc");

    /**
     * invalid values: filter.
     */
    //when
    tableController.setColumnFilter(-5, "minus");

    //then
    assert.is(model.getFilter().ColumnFilters[-5], undefined);

    //when
    tableController.setColumnFilter(500, "overKeysLength");

    //then
    assert.is(model.getFilter().ColumnFilters[500], undefined);
    assert.is(model.getFilter().ColumnFilters.length, 6);

    /**
     * invalid values: sorter.
     */
    //when
    tableController.setColumnSorter(-1, "asc");

    //then
    assert.is(model.getFilter().ColumnSorter.column, 0);

    //when
    tableController.setColumnSorter(500, "asc");

    //then
    assert.is(model.getFilter().ColumnSorter.column, 0);

    //when
    tableController.setColumnSorter(1, "undefinedState");

    //then
    assert.is(model.getFilter().ColumnSorter.state, "");
});

/**
 * Async Unit Test: getEntryByIndexAndKey.
 */
asyncTest("getEntryByIndexAndKey (async)", async assert => {

    //given
    const service         = localTestService();
    const model           = TablePresentationModel(getTableConfig());
    const tableController = TableController(model, service);
    tableController.init();

    /**
     * ScrollIndex test.
     */
    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    const cell1Content            = tableController.getEntryValueByIndexAndKey(1,1);
    const cell2Content            = tableController.getEntryValueByIndexAndKey(1,4);
    const minusIndexValue         = tableController.getEntryValueByIndexAndKey(-10,1);
    const higherThanEntriesLength = tableController.getEntryValueByIndexAndKey(1500,1);

    //then
    assert.is(cell1Content,            "Grant Dawson");
    assert.is(cell2Content,            "Khyber Pakhtoonkhwa");
    //getEntryValueByIndexAndKey() should return nothing
    assert.is(minusIndexValue,         "");
    assert.is(higherThanEntriesLength, "");

    /**
     * ColumnIndex test.
     */
    //when
    const minusColumnValue     = tableController.getEntryValueByIndexAndKey(1, -5);
    const higherThanKeysLength = tableController.getEntryValueByIndexAndKey(1, 15);
    const nan                  = tableController.getEntryValueByIndexAndKey(1, "asdf"); // warning can be ignored, because it's intentional to give an invalid parameter for test purposes

    //then
    assert.is(minusColumnValue,     "");
    assert.is(higherThanKeysLength, "");
    assert.is(nan,                  "");
});

/**
 * Unit Test: ScrollIndex gets changed (from anywhere).
 * @use-case:
 * User or function wants to jump to a specific row in the table.
 */
tableControllerSuite.add("ScrollIndex-management", assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);

    /**
     * Valid ScrollIndex
     */
    //when
    tableController.updateScrollIndex(42);

    //then
    assert.is(tableController.getScrollIndex(), 42);
    assert.is(tableController.getScrollTop(), 2520);

    /**
     * ScrollIndex is a Double Value
     */
    //when
    tableController.updateScrollIndex(10.3);

    //then
    assert.is(tableController.getScrollIndex(), 10);
    assert.is(tableController.getScrollTop(), 600);

    //when
    tableController.updateScrollIndex(9.945);

    //then
    assert.is(presentationModel.getScrollIndex(), 10);
    assert.is(presentationModel.getScrollTop(), 600);

    /**
     * ScrollIndex < 0
     */
    //when
    tableController.updateScrollIndex(-5);

    //then
    assert.is(presentationModel.getScrollIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);

    /**
     * ScrollIndex != Number
     */
    //when
    tableController.updateScrollIndex("asdf"); // warning can be ignored, because it's intentional to give an invalid parameter for test purposes

    //then
    assert.is(presentationModel.getScrollIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);
});

/**
 * Async Unit Test: ScrollIndex is set to value bigger than totalData.
 */
asyncTest("ScrollIndex > entries.length (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    tableController.init();

    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    /**
     * ScrollIndex > entries.length
     */
    //when
    tableController.updateScrollIndex(150);

    //then
    assert.is(presentationModel.getScrollIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);
});

/**
 * Unit Test: ColumnWidth of target column gets changed (from anywhere).
 * @use-case:
 * User or function changes target columnWidth.
 */
tableControllerSuite.add("columnWidth-management", assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);

    //then
    assert.is(presentationModel.getColumnWidths()[1], 240);
    assert.is(presentationModel.getColumnWidths()[2], 350);

    //when
    tableController.setColumnWidths(1, 200);
    //then
    assert.is(presentationModel.getColumnWidths()[1], 200);
    assert.is(presentationModel.getColumnWidths()[2], 390);

    //when
    tableController.setColumnWidths(1, 300);
    //then
    assert.is(presentationModel.getColumnWidths()[1], 300);
    assert.is(presentationModel.getColumnWidths()[2], 290);
});

/**
 * Unit Test: Get correct count of rendered rows.
 */
tableControllerSuite.add("get-rendered-rows-count", assert => {

    //given
    const service         = localTestService();
    const model           = stubModel();
    const tableController = TableController(model, service); //warning can be ignored, because it's a stub model with no interface

    //then
    assert.is(tableController.getRenderedRowsCount(), 8);

    //when
    model.setData([{ //not resolved because only in stub available
        id: 0,
        name: "Charity Freeman",
        email: "maecenas@outlook.edu",
        address: "P.O. Box 129, 2221 Molestie Avenue",
        region: "Upper Austria",
        country: "United Kingdom"
    }]);

    //then
    assert.is(tableController.getRenderedRowsCount(), 1);
});

tableControllerSuite.run();