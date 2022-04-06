import {asyncTest}              from "../../../../kolibri/util/test.js";
import {localTestService}            from "../../service/localTestService.js";
import {getTableConfig}         from "../../../util/testUtils.js";
import {TableController}        from "../../controller/tableController.js";
import {FiltersProjector}       from "./filtersProjector.js";
import {sleep}                  from "../../../util/util.mjs";
import {TablePresentationModel} from "../../model/tablePresentationModel.js";
import {tableConfig} from "../../config.js";

/**
 * Filters
 */
asyncTest("filtersProjector-init (async)", async assert => {

    //given
    const service         = localTestService();
    const model           = TablePresentationModel(getTableConfig());
    const tableController = TableController(model, service);
    const rootElement     = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    FiltersProjector(tableController, rootElement);
    const filterInputs = rootElement.querySelectorAll(".filter-input-field");
    const filterCells  = rootElement.querySelectorAll(".filter-cell");

    //then
    assert.is(filterInputs.length, 6);
    assert.is(filterCells .length, 6);
    assert.is(rootElement.querySelectorAll(".filter-row").length, 1);
    assert.is(filterInputs[0].placeholder, "Filter by id");
    assert.is(filterCells[0] .style.width, "100px");
});