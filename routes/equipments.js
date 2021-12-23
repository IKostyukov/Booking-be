import express from 'express';
import {equipment_controller} from '../controller/equipment_controller.js';

const Router = express.Router;
const routerEquipments = new Router();

//  ### Equipments

routerEquipments.post('/equipment', equipment_controller.createEquipment);
routerEquipments.patch('/equipment/:equipmentId', equipment_controller.updateEquipment);
routerEquipments.patch('/equipment/:equipmentId/activation', equipment_controller.activateEquipment);
routerEquipments.delete('/equipment/:equipmentId', equipment_controller.deleteEquipment);
routerEquipments.get('/equipment/:equipmentId', equipment_controller.getEquipment);
routerEquipments.get('/equipments', equipment_controller.getEquipments);

export { routerEquipments };