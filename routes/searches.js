import express from 'express';
import {equipment_controller} from '../controller/equipment_controller.js';

const Router = express.Router;
const routerSearches = new Router();

//  ### Searches

routerSearches.get('/search/equipment', equipment_controller.getSearchEquipment);

export { routerSearches };