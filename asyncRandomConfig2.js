const getTableConfig = () => ( {

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
        columnWidths: [150, 560, 250, 150, 560, 250, 560, 540]
    },
    testing: {
        SIMULATED_FETCH_DELAY: 150,
        TEST_FETCH_DELAY:      150 + 50
    }
});

export {getTableConfig};