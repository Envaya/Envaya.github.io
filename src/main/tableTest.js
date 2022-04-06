import { asyncTest }                from "../../kolibri/util/test.js";
import {TableController}            from "./controller/tableController.js";
import {TablePresentationModel}     from "./model/tablePresentationModel.js";
import {TableHeadersProjector}      from "./projectors/header/tableHeadersProjector.js";
import {FiltersProjector}           from "./projectors/header/filtersProjector.js";
import {TableBodyProjector}         from "./projectors/body/tableBodyProjector.js";
import {localTestService}                from "./service/localTestService.js";
import {sleep}                      from "../util/util.mjs";
import {getTableConfig, noService}  from "../util/testUtils.js";
import {TableFooterProjector}       from "./projectors/footer/tableFooterProjector.js";
import {tableConfig}                from "./config.js";

/**
 * E2E Test: Build new Table and fill it with initial content based on testEntries.
 * Test if View and Model are initialized as intended.
 */
asyncTest("table-init-E2E (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    const rootElement       = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableHeadersProjector(tableController, rootElement);
    FiltersProjector     (tableController, rootElement);
    TableBodyProjector   (tableController, rootElement);
    TableFooterProjector (tableController, rootElement);

    //then
    //VIEW
    assert.is(rootElement.children.length, 4);
    assert.is(rootElement.querySelectorAll(".table-header-cell").length, 6);
    assert.is(rootElement.querySelectorAll(".filter-input-field") .length, 6);
    //Expecting: 6 columns * 9 rows = 54 tableCells
    assert.is(rootElement.querySelectorAll(".table-cell").length, 54);
    assert.is(rootElement.querySelectorAll("#prefill")   .length, 1);
    assert.is(rootElement.querySelectorAll("#postfill")  .length, 1);
    assert.is(rootElement.querySelectorAll("#entries-display").length, 1);

    assert.is(rootElement.querySelector('[data-column-index="1"]').textContent, "name");
    assert.is(rootElement.querySelector(".filter1").placeholder, "Filter by name");
    assert.is(rootElement.querySelector(".cell01") .textContent, "Charity Freeman");

    //MODEL
    assert.is(presentationModel.getScrollIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);
    assert.is(presentationModel.getPrefillHeight(), 0);
    assert.is(presentationModel.getPostfillHeight(), 5460);
    assert.is(presentationModel.get_POSTFILL_INITIAL_HEIGHT(), 5460);
    assert.is(presentationModel.getColumnWidths().length, 6);

    assert.is(presentationModel.getCurrentDataSetSize(), 100);
    assert.is(presentationModel.getTotalDataSize(), 100);
    assert.is(presentationModel.getSingleDataEntry(0).name, "Charity Freeman");
    assert.is(presentationModel.getSingleDataEntry(8).name, "Yetta Heath");
});

/**
 * E2E Test: Build new Table with NO available entries.
 * Test if View and Model are initialized as intended.
 */
asyncTest("table-init-E2E-noService (async)", async assert => {

    //given
    const service           = noService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    const rootElement       = document.createElement("div");

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableHeadersProjector(tableController, rootElement);
    FiltersProjector     (tableController, rootElement);
    TableBodyProjector   (tableController, rootElement);
    TableFooterProjector (tableController, rootElement);

    //then

    //VIEW
    assert.is(rootElement.children.length, 4);
    assert.is(rootElement.querySelectorAll(".table-header-cell").length, 0);
    assert.is(rootElement.querySelectorAll(".filterInputField") .length, 0);
    assert.is(rootElement.querySelectorAll(".table-cell")       .length, 0);
    assert.is(rootElement.querySelectorAll("#prefill")          .length, 1);
    assert.is(rootElement.querySelectorAll("#postfill")         .length, 1);
    assert.is(rootElement.querySelectorAll("#entries-display")  .length, 1);

    //MODEL
    assert.is(presentationModel.getScrollIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);
    assert.is(presentationModel.getPrefillHeight(), 0);
    assert.is(presentationModel.getPostfillHeight(), 0);
    assert.is(presentationModel.get_POSTFILL_INITIAL_HEIGHT(), 0);
    assert.is(presentationModel.getColumnWidths().length, 6);

    assert.is(presentationModel.getCurrentDataSetSize(), 0);
    assert.is(presentationModel.getTotalDataSize(), 0);
    assert.is(presentationModel.getSingleDataEntry(0), undefined);
});

/**
 * Async Test: correct batching based on changed scrollIndex.
 */
asyncTest("scrollIndex-batching-MODEL (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    tableController.init();

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getData().size, (3 * (getTableConfig().app.nrVisibleRows + 1)));

    //when
    tableController.updateScrollIndex(42);
    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getData().size,   (4 * (getTableConfig().app.nrVisibleRows + 1)));
    assert.is(presentationModel.getData().has(1), true);
    assert.is(presentationModel.getData().has(27),false);
});

/**
 * Async Test: Simulate Scrolling and see if correct data is fetched.
 */
asyncTest("scrolling-batching (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    const rootElement       = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableBodyProjector   (tableController, rootElement);

    //then
    assert.is(presentationModel.getData().size,(3 * (getTableConfig().app.nrVisibleRows + 1)));
    assert.is(presentationModel.getData().has(1), true);
    assert.is(rootElement.querySelector('.cell01').textContent, "Charity Freeman");

    //when
    tableController.scrollTopChangeHandler((getTableConfig().app.rowHeight * 40));

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getData().size,(3 * (getTableConfig().app.nrVisibleRows + 1) + getTableConfig().app.nrVisibleRows + 1));
    assert.is(presentationModel.getData().has(1), true);
    assert.is(presentationModel.getData().has(22),true);
    assert.is(rootElement.querySelector('.cell01').textContent, "Caleb Dillard");

    //when
    tableController.scrollTopChangeHandler(5460);

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getData().size,(5 * (getTableConfig().app.nrVisibleRows + 1)));
    assert.is(presentationModel.getData().has(1), true);
    assert.is(presentationModel.getData().has(22),true);
    assert.is(presentationModel.getData().has(94),true);
    assert.is(rootElement.querySelector('.cell01').textContent, "Lucius Estrada");
});

/**
 * Async Test: Get correct data batch after filtering (model side).
 */
asyncTest("filter-batching-MODEL (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    tableController.init();

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getSingleDataEntry(0).name, "Charity Freeman");
    assert.is(JSON.stringify(Array.from(presentationModel.getData().values()).slice(0,11)), JSON.stringify([
        {"id":0,"name":"Charity Freeman","email":"maecenas@outlook.edu","address":"P.O. Box 129, 2221 Molestie Avenue","region":"Upper Austria","country":"United Kingdom"},
        {"id":1,"name":"Grant Dawson","email":"fusce@google.edu","address":"Ap #618-1798 Dui. Rd.","region":"Khyber Pakhtoonkhwa","country":"France"},
        {"id":2,"name":"Dorian Whitaker","email":"sit@aol.edu","address":"1155 Nibh St.","region":"Illes Balears","country":"Costa Rica"},
        {"id":3,"name":"John Bowers","email":"orci.ut@yahoo.ca","address":"P.O. Box 345, 9689 Dolor, Avenue","region":"Guanajuato","country":"Peru"},
        {"id":4,"name":"Serina Blackburn","email":"metus.facilisis@yahoo.com","address":"183-3572 Viverra. Av.","region":"Utrecht","country":"Turkey"},
        {"id":5,"name":"Anastasia Brewer","email":"nulla@hotmail.ca","address":"809-432 Vestibulum Rd.","region":"Waals-Brabant","country":"Russian Federation"},
        {"id":6,"name":"Prescott Gill","email":"ipsum.porta@outlook.ca","address":"5978 Mi St.","region":"Vorarlberg","country":"Spain"},
        {"id":7,"name":"Alea Phillips","email":"augue.scelerisque@aol.org","address":"352-939 Faucibus. Rd.","region":"Rio Grande do Sul","country":"Mexico"},
        {"id":8,"name":"Yetta Heath","email":"ac@outlook.net","address":"304-9346 Elementum, Street","region":"Ceuta","country":"United Kingdom"},
        {"id":9,"name":"Mariko Hoffman","email":"mauris.non.dui@icloud.com","address":"Ap #348-433 Eget Ave","region":"Australian Capital Territory","country":"Chile"},
        {"id":10,"name":"Alice Kinney","email":"dis.parturient@aol.net","address":"362 Odio. Rd.","region":"Antwerpen","country":"United States"},
        ])
    );
    assert.is(JSON.stringify(Array.from(presentationModel.getData().values()).slice(26,27)), JSON.stringify([
            {"id":26,"name":"Caldwell Michael","email":"eu.arcu.morbi@google.ca","address":"364-4260 At Avenue","region":"Nord-Pas-de-Calais","country":"Russian Federation"}
        ])
    );
    //when
    tableController.setColumnFilter(1, "Dorian");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getSingleDataEntry(0).name, "Dorian Whitaker");

    //when
    tableController.setColumnFilter(1, "Do");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getData().size, 6);
    assert.is(presentationModel.getSingleDataEntry(0).name, "Dorian Whitaker");

    //when
    tableController.setColumnSorter(1, "asc");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getData().get(5).name, "Anjolie Mercado");
});

/**
 * Async Test: Get correct data batch after filtering (view side).
 */
asyncTest("filter-batching-VIEW (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    const rootElement       = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableBodyProjector(tableController, rootElement);

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(rootElement.querySelector(".cell01").textContent, "Charity Freeman");

    //when
    tableController.setColumnFilter(1, "Dorian");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(rootElement.querySelector(".cell01").textContent, "Dorian Whitaker");

    //when
    tableController.setColumnFilter(1, "Do");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(rootElement.querySelector(".cell01").textContent, "Dorian Whitaker");

    //when
    tableController.setColumnSorter(1, "desc");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(rootElement.querySelector(".cell01").textContent, "Anjolie Mercado");
});

/**
 * Async Unit Test: Prefill and Postfill Model managing + display.
 */
asyncTest("prefill/postfill-management-MODEL-VIEW (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    const rootElement       = document.createElement("div");
    tableController.init();

    TableBodyProjector(tableController, rootElement);

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    //then
    assert.is(presentationModel.getPrefillHeight(), 0);
    assert.is(presentationModel.get_POSTFILL_INITIAL_HEIGHT(), 5460);
    assert.is(presentationModel.getPostfillHeight(), 5460);
    assert.is(rootElement.querySelector("#prefill") .style.height, "0px");
    assert.is(rootElement.querySelector("#postfill").style.height, "5460px");

    //when
    tableController.updateScrollIndex(50);

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getPrefillHeight(), 3000);
    assert.is(presentationModel.get_POSTFILL_INITIAL_HEIGHT(), 5460);
    assert.is(presentationModel.getPostfillHeight(), 2460);
    assert.is(rootElement.querySelector("#prefill") .style.height, "3000px");
    assert.is(rootElement.querySelector("#postfill").style.height, "2460px");

    //when
    tableController.setColumnFilter(1, "m");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getPrefillHeight(), 0);
    assert.is(presentationModel.getPostfillHeight(), 1620);
    assert.is(rootElement.querySelector("#prefill") .style.height, "0px");
    assert.is(rootElement.querySelector("#postfill").style.height, "1620px");

    //when
    tableController.setColumnFilter(1, "mari");

    //then
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    assert.is(presentationModel.getPrefillHeight(), 0);
    assert.is(presentationModel.getPostfillHeight(), 0);
    assert.is(rootElement.querySelector("#prefill") .style.height, "0px");
    assert.is(rootElement.querySelector("#postfill").style.height, "0px");
});

/**
 * Async Test: Column resizing in DOM.
 */
asyncTest("column-resizing (async)", async assert => {

    //given
    const service           = localTestService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    const rootElement       = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableHeadersProjector(tableController, rootElement);
    FiltersProjector     (tableController, rootElement);
    TableBodyProjector   (tableController, rootElement);

    //then
    assert.is(rootElement.querySelector('[data-column-index="1"]').style.width, "240px");
    assert.is(rootElement.querySelector('.filter1')               .style.width, "240px");
    assert.is(rootElement.querySelector('.cell01')                .style.width, "240px");

    assert.is(rootElement.querySelector('[data-column-index="2"]').style.width, "350px");
    assert.is(rootElement.querySelector('.filter2')               .style.width, "350px");
    assert.is(rootElement.querySelector('.cell02')                .style.width, "350px");

    //when
    tableController.setColumnWidths(1, 340);

    //then
    assert.is(rootElement.querySelector('[data-column-index="1"]').style.width, "340px");
    assert.is(rootElement.querySelector('.filter1')               .style.width, "340px");
    assert.is(rootElement.querySelector('.cell01')                .style.width, "340px");

    assert.is(rootElement.querySelector('[data-column-index="2"]').style.width, "250px");
    assert.is(rootElement.querySelector('.filter2')               .style.width, "250px");
    assert.is(rootElement.querySelector('.cell02')                .style.width, "250px");
});