import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {activityFormCheck} from '../check/activity_form_check.js';
import { check, oneOf, validationResult } from 'express-validator';


const Router = express.Router;
const routerActivities = new Router();

//  ### Activities

routerActivities.get('/activity/:activityId', activity_controller.activityRules.forGettinOne, activity_controller.validateActivity, activity_controller.getActivity);
routerActivities.get('/activities', activity_controller.activityRules.forGettingAll, activity_controller.validateActivity, activity_controller.getActivities);
routerActivities.get('/activities/popular', activity_controller.getPopularActivities);
routerActivities.post('/activity', activityFormCheck.forCreate, activity_controller.activityRules.forCreating, activity_controller.validateActivity, activity_controller.createActivity);
routerActivities.patch('/activity/:activityId', activityFormCheck.forCreate, activity_controller.updateActivity);
routerActivities.patch('/activity/:activityId/activation', activityFormCheck.forActivate, activity_controller.activityRules.forActivation, activity_controller.validateActivity, activity_controller.activateActivity);



routerActivities.delete('/activity/:activityId',  activity_controller.deleteActivity);


export { routerActivities };