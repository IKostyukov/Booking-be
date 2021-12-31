import express from 'express';
import { service_controller } from '../controller/service_controller.js';

const Router = express.Router;
const routerServices = new Router();

//  ### Services

routerServices.post('/service', service_controller.createService);
routerServices.patch('/service/:id/activation', service_controller.activateService);
routerServices.patch('/service/:id', service_controller.updateService);
routerServices.delete('/service/:id', service_controller.deleteService);
routerServices.get('/service/:id', service_controller.getService);
routerServices.get('/service', service_controller.getServices);

export { routerServices };