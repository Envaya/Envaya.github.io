/**
 * @module model/tablePresentationModel
 */

import {Observable} from "../../../kolibri/observable.js";
import { ObservableMap } from "../../util/util.mjs";

export { TablePresentationModel };

/**
 * @typedef  { Object } TablePresentationModel
 * @property { function(!Number, !Object)   : void    }  initData
 * @property { function(!Number)            : String  }  getSingleDataEntry
 * @property { function()                   : void    }  getData
 * @property { function(!Number, !Object)   : void    }  setDataEntry
 * @property { function(!Number)            : void    }  deleteDataEntry
 * @property { function(!Number)            : Boolean }  hasDataEntry
 * @property { function()                   : Number  }  getDataSize
 * @property { function(!Number)            : Boolean }  hasEntry
 *
 * @property { function(!Number)            : void    }  setTotalDataSize
 * @property { function()                   : Number  }  getTotalDataSize
 * @property { function(!Number)            : void    }  setCurrentDataSetSize
 * @property { function()                   : Number  }  getCurrentDataSetSize
 * @property { function()                   : void    }  getEntryKeys
 * @property { function(!Object)            : void    }  setEntryKeys
 *
 * @property { function()                   : Object  }  getFilter
 * @property { function(!Object)            : void    }  setFilter
 * @property { function()                   : Number  }  getScrollIndex
 * @property { function(!Number)            : void    }  setScrollIndex
 *
 * @property { function()                   : Number        }  getScrollTop
 * @property { function(!Number)            : void          }  setScrollTop
 * @property { function()                   : Number        }  getPrefillHeight
 * @property { function(!Number)            : void          }  setPrefillHeight
 * @property { function()                   : Number        }  get_POSTFILL_INITIAL_HEIGHT
 * @property { function(!Number)            : void          }  set_POSTFILL_INITIAL_HEIGHT
 * @property { function()                   : Number        }  getPostfillHeight
 * @property { function(!Number)            : void          }  setPostfillHeight
 * @property { function()                   : Number        }  getViewPortHeight
 * @property { function(!Number)            : void          }  setViewPortHeight
 * @property { function()                   : Number        }  getRowHeight
 * @property { function(!Number)            : void          }  setRowHeight
 * @property { function()                   : Number        }  get_NUMBER_OF_RENDERED_ROWS
 * @property { function(!Number)            : void          }  set_NUMBER_OF_RENDERED_ROWS
 * @property { function()                   : Number        }  get_NUMBER_OF_VISIBLE_ROWS
 * @property { function(!Number)            : void          }  set_NUMBER_OF_VISIBLE_ROWS
 * @property { function()                   : Array<Number> }  getColumnWidths
 * @property { function(!Array<Number>)     : void          }  setColumnWidths
 * @property { function()                   : void          }  clearData
 *
 * @property { function(callback: onValueChangeCallback<Object>)        : void }  onDataInit
 * @property { function(callback: onValueChangeCallback<Object>)        : void }  onDataChanged
 * @property { function(callback: onValueChangeCallback<Object>)        : void }  onEntryKeysChanged
 * @property { function(callback: onValueChangeCallback<Object>)        : void }  onFilterChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  onScrollIndexChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  onScrollTopChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  onPrefillHeightChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  onPostfillHeightChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  onViewPortHeightChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  onRowHeightChanged
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  on_NUMBER_OF_RENDERED_ROWS_Changed
 * @property { function(callback: onValueChangeCallback<Number>)        : void }  on_NUMBER_OF_VISIBLE_ROWS_Changed
 * @property { function(callback: onValueChangeCallback<Array<Number>>) : void }  onColumnWidthsChanged
 */

/**
 * Creates a presentation model for being used to bind against the table Projectors.
 * Access to this model is only provided by a {@link TableController}.
 * @constructor
 * @param   { !TableConfig } tableConfig - Object to define parameters for the table.
 * @returns { TablePresentationModel }
 */
const TablePresentationModel = tableConfig => {

    const data                    = ObservableMap(new Map());
    const totalDataSize           = Observable(0);
    const currentDataSetSize      = Observable(0);
    const entryKeys               = Observable([]);

    const filter                  = Observable(tableConfig.app.filterObj);
    const scrollIndex             = Observable(0);

    const scrollTop               = Observable(0);
    const prefillHeight           = Observable(0);
    let   POSTFILL_INITIAL_HEIGHT = 0;
    const postfillHeight          = Observable(0);
    const viewPortHeight          = Observable(0);
    const rowHeight               = Observable(tableConfig.app.rowHeight);
    const NUMBER_OF_VISIBLE_ROWS  = Observable(tableConfig.app.nrVisibleRows);
    const NUMBER_OF_RENDERED_ROWS = Observable(tableConfig.app.nrVisibleRows + 1);
    const columnWidths            = Observable(tableConfig.app.columnWidths);

    return {
        initData:                           data.init,
        getSingleDataEntry:                 data.getItem,
        getData:                            data.get,
        setDataEntry:                       data.add,
        deleteDataEntry:                    data.del,
        hasDataEntry:                       data.has,
        getDataSize:                        data.size,
        onDataInit:                         data.onInit,
        onDataChanged:                      data.onChange,
        hasEntry:                           data.has,
        clearData:                          data.clear,

        setTotalDataSize:                   totalDataSize          .setValue,
        getTotalDataSize:                   totalDataSize          .getValue,
        setCurrentDataSetSize:              currentDataSetSize     .setValue,
        getCurrentDataSetSize:              currentDataSetSize     .getValue,
        getEntryKeys:                       entryKeys              .getValue,
        setEntryKeys:                       entryKeys              .setValue,
        onEntryKeysChanged:                 entryKeys              .onChange,

        getFilter:                          filter                 .getValue,
        setFilter:                          filter                 .setValue,
        getScrollIndex:                     scrollIndex            .getValue,
        setScrollIndex:                     scrollIndex            .setValue,

        getScrollTop:                       scrollTop              .getValue,
        setScrollTop:                       scrollTop              .setValue,
        getPrefillHeight:                   prefillHeight          .getValue,
        setPrefillHeight:                   prefillHeight          .setValue,
        get_POSTFILL_INITIAL_HEIGHT:        ()     => POSTFILL_INITIAL_HEIGHT,
        set_POSTFILL_INITIAL_HEIGHT:        height => POSTFILL_INITIAL_HEIGHT = height,
        getPostfillHeight:                  postfillHeight         .getValue,
        setPostfillHeight:                  postfillHeight         .setValue,
        getViewPortHeight:                  viewPortHeight         .getValue,
        setViewPortHeight:                  viewPortHeight         .setValue,
        getRowHeight:                       rowHeight              .getValue,
        setRowHeight:                       rowHeight              .setValue,
        get_NUMBER_OF_RENDERED_ROWS:        NUMBER_OF_RENDERED_ROWS.getValue,
        set_NUMBER_OF_RENDERED_ROWS:        NUMBER_OF_RENDERED_ROWS.setValue,
        get_NUMBER_OF_VISIBLE_ROWS:         NUMBER_OF_VISIBLE_ROWS .getValue,
        set_NUMBER_OF_VISIBLE_ROWS:         NUMBER_OF_VISIBLE_ROWS .setValue,
        getColumnWidths:                    columnWidths           .getValue,
        setColumnWidths:                    columnWidths           .setValue,

        onFilterChanged:                    filter                 .onChange,
        onScrollIndexChanged:               scrollIndex            .onChange,
        onScrollTopChanged:                 scrollTop              .onChange,
        onPrefillHeightChanged:             prefillHeight          .onChange,
        onPostfillHeightChanged:            postfillHeight         .onChange,
        onViewPortHeightChanged:            viewPortHeight         .onChange,
        onRowHeightChanged:                 rowHeight              .onChange,
        on_NUMBER_OF_RENDERED_ROWS_Changed: NUMBER_OF_RENDERED_ROWS.onChange,
        on_NUMBER_OF_VISIBLE_ROWS_Changed:  NUMBER_OF_VISIBLE_ROWS .onChange,
        onColumnWidthsChanged:              columnWidths           .onChange
    }
}