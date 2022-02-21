import express from 'express';
import { equipment_controller } from '../controller/equipment_controller.js';
import { equipmentFormCheck } from '../check_forms/equipment_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerEquipments = new Router();

const check_create_form = equipmentFormCheck.forCreateUpdate
const check_update_form = equipmentFormCheck.forCreateUpdate
const check_activate_form = equipmentFormCheck.forActivate
const check_retrieve_form = equipmentFormCheck.forRetrieve

const check_schema = checkSchema(equipment_controller.validationSchema);
const chesk_result = equipment_controller.checkResult;

//  ### Equipments

routerEquipments.post('/equipment', check_create_form, check_schema, chesk_result, equipment_controller.createEquipment);
routerEquipments.patch('/equipment/:equipmentId', check_update_form, check_schema, chesk_result, equipment_controller.updateEquipment);
routerEquipments.patch('/equipment/:equipmentId/activation', check_activate_form, check_schema, chesk_result, equipment_controller.activateEquipment);
routerEquipments.delete('/equipment/:equipmentId', check_schema, chesk_result, equipment_controller.deleteEquipment);
routerEquipments.get('/equipment/:equipmentId', check_schema, chesk_result, equipment_controller.retrieveSingleEquipment);
routerEquipments.get('/equipment', check_retrieve_form, check_schema, chesk_result, equipment_controller.retrieveMultipleEquipments);

export { routerEquipments };