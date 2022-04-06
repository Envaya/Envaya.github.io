const tableConfig = {

    app: {
        rowHeight: 60,
        nrVisibleRows: 8,
        filterObj: {
            ColumnFilters: ['', '', '', '', '', ''],
            ColumnSorter:
                {
                    column: undefined,
                    state:  ''
                }
        },
        columnWidths: [100, 240, 350, 350, 240, 240]
    },
    testing: {
        SIMULATED_FETCH_DELAY: 150,
        TEST_FETCH_DELAY:      150 + 50
    }
};

export {tableConfig};