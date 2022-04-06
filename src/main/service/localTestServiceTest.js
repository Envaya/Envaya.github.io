import {asyncTest, TestSuite} from "../../../kolibri/util/test.js";
import {localTestService}          from "./localTestService.js";

const serviceSuite = TestSuite("service");

/**
 * Unit Test: applyFilter
 */
serviceSuite.add("applyFilter", assert => {

    //given
    const service = localTestService();

    //when
    const filter1 = {
        ColumnFilters: ['', 'cha', '', '', '', ''],
        ColumnSorter:
            {
                column: undefined,
                state:  ''
            }
    }
    const filteredData1 = service.applyFilter(filter1); //unresolved because function is only exposed for test purposes

    //then
    assert.is(filteredData1.length, 5);
    assert.is(filteredData1[1].name, "Caldwell Michael");

    //when
    const filter2 = {
        ColumnFilters: ['', 'cha', '', '', '', ''],
        ColumnSorter:
            {
                column: 1,
                state:  'asc'
            }
    }
    const filteredData2 = service.applyFilter(filter2); //unresolved because function is only exposed for test purposes

    //then
    assert.is(filteredData2.length, 5);
    assert.is(filteredData2[1].name, "Charles King");

    /**
     * no filter.
     */
    //when
    const filterNONE = {
        ColumnFilters: ['', '', '', '', '', ''],
        ColumnSorter:
            {
                column: undefined,
                state:  ''
            }
    }
    const filteredDataNONE = service.applyFilter(filterNONE); //unresolved because function is only exposed for test purposes

    //then
    assert.is(filteredDataNONE.length, 100);
    assert.is(filteredDataNONE[99].name, "Randall Russell");
});

/**
 * Async Unit Test: getDataWithFilter
 */
asyncTest("getDataWithFilter (async)", async assert => {

    //given
    const service = localTestService();

    //when
    const filterNONE = {
        ColumnFilters: ['', '', '', '', '', ''],
        ColumnSorter:
            {
                column: undefined,
                state:  ''
            }
    }

    await service.getDataWithFilter(filterNONE, 0, 30)
        .then(promises => {
            const data               = promises[0];
            const currentDataSetSize = promises[1];
            const totalDataSize      = promises[2];
            //then
            assert.is(data.length, 30);
            assert.is(data[0].name,  "Charity Freeman");
            assert.is(data[29].name, "Signe Moreno");
            assert.is(Object.keys(data[0]).length, 6);
            assert.is(Object.keys(data[0])[1], "name");
            assert.is(currentDataSetSize, 100);
            assert.is(totalDataSize, 100);
        })
        .catch(e => console.error(`The following error occurred while updating table data: ${e.message}`));

    //when
    const filter2 = {
        ColumnFilters: ['', '', '', '', '', 'peru'],
        ColumnSorter:
            {
                column: 1,
                state:  'asc'
            }
    }

    await service.getDataWithFilter(filter2, 0, 30)
        .then(promises => {
            const data               = promises[0];
            const currentDataSetSize = promises[1];
            const totalDataSize      = promises[2];
            //then
            assert.is(data.length, 4);
            assert.is(data[0].name,  "Leo Acosta");
            assert.is(data[3].name,  "Cathleen Howell");
            assert.is(Object.keys(data[0]).length, 6);
            assert.is(Object.keys(data[0])[1], "name");
            assert.is(currentDataSetSize, 4);
            assert.is(totalDataSize, 100);
        })
        .catch(e => console.error(`The following error occurred while updating table data: ${e.message}`));
});

/**
 * Async Unit Test: getSingleDataEntry
 */
asyncTest("getSingleDataEntry (async)", async assert => {

    //given
    const service = localTestService();
    const filter = {
        ColumnFilters: ['', '', '', '', '', ''],
        ColumnSorter:
            {
                column: undefined,
                state:  ''
            }
    }

    await service.getSingleDataEntry(filter, 0)
        .then(data => {
            //then
            assert.is(data.id,      0);
            assert.is(data.name,    "Charity Freeman");
            assert.is(data.email,   "maecenas@outlook.edu");
            assert.is(data.address, "P.O. Box 129, 2221 Molestie Avenue");
            assert.is(data.region,  "Upper Austria");
            assert.is(data.country, "United Kingdom");
        })
        .catch(e => console.error(`The following error occurred while updating the data of a table row: ${e.message}`));
});

serviceSuite.run();