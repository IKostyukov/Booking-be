import express from 'express';
import { advantage_controller } from '../controller/advantage_controller.js';

const Router = express.Router;
const routerAdvantages = new Router();

//  ### Advantages

routerAdvantages.post('/advantage', advantage_controller.createAdvantage);
routerAdvantages.patch('/advantage/:id', advantage_controller.updateAdvantage);
routerAdvantages.patch('/advantage/:id/activation', advantage_controller.activateAdvantage);
routerAdvantages.delete('/advantage/:id', advantage_controller.deleteAdvantage);
routerAdvantages.get('/advantage/:id', advantage_controller.getAdvantage);
routerAdvantages.get('/advantages', advantage_controller.getAdvantages);

export { routerAdvantages };