import express from 'express';
import {equipment_controller} from '../controller/equipment_controller.js';
import {equipmentFormCheck} from '../check_forms/equipment_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerEquipments = new Router();

const check_create_form = equipmentFormCheck.forCreateUpdateGetAll
const check_update_form = equipmentFormCheck.forCreateUpdateGetAll
const check_activate_form = equipmentFormCheck.forActivate
const check_get_form = equipmentFormCheck.forCreateUpdateGetAll

const check_schema = checkSchema(equipment_controller.validationSchema);
const chesk_result = equipment_controller.checkResult;

//  ### Equipments

routerEquipments.post('/equipment', check_create_form, check_schema, chesk_result, equipment_controller.createEquipment);
routerEquipments.patch('/equipment/:equipmentId', check_update_form, check_schema, chesk_result, equipment_controller.updateEquipment);
routerEquipments.patch('/equipment/:equipmentId/activation', check_activate_form, check_schema, chesk_result, equipment_controller.activateEquipment);
routerEquipments.delete('/equipment/:equipmentId', check_schema, chesk_result, equipment_controller.deleteEquipment);
routerEquipments.get('/equipment/:equipmentId', check_schema, chesk_result, equipment_controller.getOneEquipment);
routerEquipments.get('/equipments', check_get_form, check_schema, chesk_result, equipment_controller.getAllEquipments);

export { routerEquipments };