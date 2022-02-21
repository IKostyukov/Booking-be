import express from 'express';
import { equipment_controller } from '../controller/equipment_controller.js';
import { equipmentFormCheck } from '../check_forms/equipment_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerSearches = new Router();

const check_search_form = equipmentFormCheck.forSearch
const check_schema = checkSchema(equipment_controller.searchEquipmentValidationSchema);
const chesk_result = equipment_controller.checkResult;

//  ### Searches

routerSearches.get('/search/equipment', check_search_form, check_schema, chesk_result, equipment_controller.searchEquipment);

export { routerSearches };