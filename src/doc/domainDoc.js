/**
 * Describes the object used for initializing and testing a table component.
 * @typedef  { Object } TableConfig
 * @property { ApplicationConfig } app
 * @property { TestingConfig     } testing
 * @example
 * {
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
            columnWidths: [150, 560, 250, 150, 560, 250, 560, 540]
        },
        testing: {
            SIMULATED_FETCH_DELAY: 150,
            TEST_FETCH_DELAY:      150 + 50
        }
    }
 */

/**
 * Describes the object used for initializing a table component.
 * @typedef  { Object } ApplicationConfig
 * @property { !Number       } rowHeight     - Defines the height of the rendered table rows in pixels.
 * This value must be at least 5 greater than the vertical size of the content (incl. padding) of the cells in order for the scrolling to work properly.
 * This is due to the cells using the css property display: table-cell, which prevents the elements from shrinking below their content size.
 * @property { !Number       } nrVisibleRows - Defines the number of rendered rows the table displays at a time.
 * @property { !Filter       } filterObj
 * @property { !ColumnWidths } columnWidths
 * @example
 * {
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
        columnWidths: [150, 560, 250, 150, 560, 250, 560, 540]
    }
 */

/**
 * Describes the object used for testing a table component.
 * @typedef  { Object } TestingConfig
 * @property { !Number } SIMULATED_FETCH_DELAY - Delay in ms that is used for testing simulating asynchronous data calls.
 * @example
 * {
        SIMULATED_FETCH_DELAY: 150
    }
 */

/**
 * Describes the object used for testing a table component.
 * @typedef  { Object } TestingConfig
 * @property { !Number } TEST_FETCH_DELAY - Delay in ms that is used in tests while testing simulating asynchronous data calls.
 *                                       + 50ms to make sure the test runs AFTER data is fetched.
 * @example
 * {
        TEST_FETCH_DELAY: 150 + 50
    }
 */

/**
 * Describes a filter object.
 * @typedef  { Object } Filter
 * @property { !Array<string> } ColumnFilters
 * @property { !Object        } ColumnSorter
 * @example
 * {
      ColumnFilters: [
        "", "u", "z", "", ""
      ],
      ColumnSorter:
        {
            column: 1,
            state: "desc"
        }
    }
 */

/**
 * Describes the object used for sorting.
 * @typedef  { Object } ColumnSorter
 * @property { !Number           } column - The index of the column the sorting applies to.
 * @property { ('asc'|'desc'|'') } state  - The sorting criteria.
 * @example
 * {
        column: 1,
        state: "desc"
    }
 */

/**
 * Describes the column width property.
 * @typedef ColumnWidths
 * @type { Array }
 * @example
 {
       [20, 40, 60, 80, 60, 40]
   }
 */

/**
 * Describes one entry of a dataset. All properties of a data entry must be accessible on the first level.
 * @typedef { Object } Entry
 * @example
 * {id:0, name: "Hans Muster", email: "hans.muster@gmail.com", address: "9038 Metus Rd.", country: "New Zealand", region: "Melilla"}
 */