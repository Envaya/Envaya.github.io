import { asyncAPIService } from "./asyncAPIService.js";
import { TableController }  from "./src/main/controller/tableController.js";
import { inputBox }         from "./src/util/inputBox.js";
import { outputBox }        from "./src/util/outputBox.js";
import { TablePresentationModel } from "./src/main/model/tablePresentationModel.js";
import {TableHeadersProjector} from "./src/main/projectors/header/tableHeadersProjector.js";
import {FiltersProjector} from "./src/main/projectors/header/filtersProjector.js";
import {TableBodyProjector} from "./src/main/projectors/body/tableBodyProjector.js";
import {TableFooterProjector} from "./src/main/projectors/footer/tableFooterProjector.js";
import {tableConfig} from "./asyncRandomConfig.js";

/**
 * Initialize service, model and controller.
 */
const services          = await asyncAPIService(100);
const presentationModel = TablePresentationModel(tableConfig);
const tableController   = TableController(presentationModel, services);

/**
 * Initialize controller and fetch initial data.
 */
tableController.init();

/**
 * Define HTML rootElement which represents the top-level HTML Element.
 * All other elements must be descendants of this element.
 */
const rootElement = document.getElementById('api-demo-table-container');

/**
 * Initializing the views.
 */
TableHeadersProjector(tableController, rootElement);
FiltersProjector     (tableController, rootElement);
TableBodyProjector   (tableController, rootElement);