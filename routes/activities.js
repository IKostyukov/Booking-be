import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';

const Router = express.Router;
const routerActivities = new Router();

//  ### Activities

routerActivities.get('/activity/:id', activity_controller.getActivity);
routerActivities.get('/activities', activity_controller.getActivities);
routerActivities.get('/activities/popular', activity_controller.getPopularActivities);
routerActivities.post('/activity', activity_controller.createActivity);
routerActivities.patch('/activity/:id', activity_controller.updateActivity);
routerActivities.patch('/activity/:id/activation', activity_controller.activateActivity);
routerActivities.delete('/activity/:id', activity_controller.deleteActivity);


export { routerActivities };