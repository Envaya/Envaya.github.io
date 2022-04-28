const tableConfig = {

    app: {
        rowHeight: 60,
        nrVisibleRows: 10,
        filterObj: {
            ColumnFilters: ['', '', '', '', '', '', '', ''],
            ColumnSorter:
                {
                    column: undefined,
                    state:  ''
                }
        },
        columnWidths: [260, 300, 250, 200]
    },
    testing: {
        SIMULATED_FETCH_DELAY: 150,
        TEST_FETCH_DELAY:      150 + 50
    }
};

export {tableConfig};