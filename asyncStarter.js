import { asyncRandomService } from "./asyncRandomService.js";
import { TableController }  from "./src/main/controller/tableController.js";
import { inputBox }         from "./src/util/inputBox.js";
import { outputBox }        from "./src/util/outputBox.js";
import { TablePresentationModel } from "./src/main/model/tablePresentationModel.js";
import {TableHeadersProjector} from "./src/main/projectors/header/tableHeadersProjector.js";
import {FiltersProjector} from "./src/main/projectors/header/filtersProjector.js";
import {TableBodyProjector} from "./src/main/projectors/body/tableBodyProjector.js";
import {TableFooterProjector} from "./src/main/projectors/footer/tableFooterProjector.js";
import {getTableConfig} from "./asyncRandomConfig2.js";

/**
 * Initialize service, model and controller.
 */
const services          = asyncRandomService(100);
const presentationModel = TablePresentationModel(getTableConfig());
const tableController   = TableController(presentationModel, services);

/**
 * Initialize controller and fetch initial data.
 */
tableController.init();

/**
 * Define HTML rootElement which represents the top-level HTML Element.
 * All other elements must be descendants of this element.
 */
const rootElement = document.getElementById('demo-table-container');

/**
 * Initializing the views.
 */
TableHeadersProjector(tableController, rootElement);
FiltersProjector     (tableController, rootElement);
TableBodyProjector   (tableController, rootElement);
TableFooterProjector (tableController, rootElement);

/**
 * Initializing separate views for development and demonstration purposes.
 */
inputBox (tableController);
outputBox(tableController);