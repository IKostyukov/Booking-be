import express from 'express';
import { advantage_controller } from '../controller/advantage_controller.js';
import {advantageFormCheck} from '../check_forms/advantage_form_check.js';
import { checkSchema } from 'express-validator';
const Router = express.Router;
const routerAdvantages = new Router();

const check_create_form = advantageFormCheck.forCreateUpdateGetAll
const check_update_form = advantageFormCheck.forCreateUpdateGetAll
const check_activate_form = advantageFormCheck.forActivate
const check_get_form = advantageFormCheck.forCreateUpdateGetAll

const check_schema = checkSchema(advantage_controller.validationSchema);
const chesk_result = advantage_controller.checkResult;

//  ### Advantages

routerAdvantages.post('/advantage', check_create_form, check_schema, chesk_result, advantage_controller.createAdvantage);
routerAdvantages.patch('/advantage/:advantageId', check_update_form, check_schema, chesk_result, advantage_controller.updateAdvantage);
routerAdvantages.patch('/advantage/:advantageId/activation', check_activate_form, check_schema, chesk_result,  advantage_controller.activateAdvantage);
routerAdvantages.delete('/advantage/:advantageId', check_schema, chesk_result, advantage_controller.deleteAdvantage);
routerAdvantages.get('/advantage/:advantageId', check_schema, chesk_result, advantage_controller.getOneAdvantage);
routerAdvantages.get('/advantages', check_get_form, check_schema, chesk_result, advantage_controller.getAllAdvantages);

export { routerAdvantages };