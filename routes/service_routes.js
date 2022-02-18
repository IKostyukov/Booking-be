import express from 'express';
import { service_controller } from '../controller/service_controller.js';
import { serviceFormCheck } from '../check_forms/service_form_check.js';
import { checkSchema } from 'express-validator';
const Router = express.Router;
const routerServices = new Router();

const check_create_form = serviceFormCheck.forCreateUpdate
const check_update_form = serviceFormCheck.forCreateUpdate
const check_activate_form = serviceFormCheck.forActivate
const check_retrieve_form = serviceFormCheck.forRetrieve

const check_schema = checkSchema(service_controller.validationSchema);
const chesk_result = service_controller.checkResult;

//  ### Services

routerServices.post('/service', check_create_form, check_schema, chesk_result, service_controller.createService);
routerServices.patch('/service/:serviceId', check_update_form, check_schema, chesk_result, service_controller.updateService);
routerServices.patch('/service/:serviceId/activation', check_activate_form, check_schema, chesk_result, service_controller.activateService);
routerServices.delete('/service/:serviceId', check_schema, chesk_result, service_controller.deleteService);
routerServices.get('/service/:serviceId', check_schema, chesk_result, service_controller.retrieveSingleService);
routerServices.get('/service', check_retrieve_form, check_schema, chesk_result, service_controller.retrieveMultipleServices);

export { routerServices };