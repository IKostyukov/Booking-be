import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {activityFormCheck} from '../Check_forms/activity_form_check.js';
import { check, oneOf, validationResult } from 'express-validator';


const Router = express.Router;
const routerActivities = new Router();

//  ### Activities

routerActivities.get('/activity/:activityId', activity_controller.validationBodyRules.forGettingOne, activity_controller.checkRules, activity_controller.getActivity);
routerActivities.get('/activities', activity_controller.validationBodyRules.forGettingAll, activity_controller.checkRules, activity_controller.getActivities);
routerActivities.get('/activities/popular', activity_controller.getPopularActivities);
routerActivities.post('/activity', activityFormCheck.forCreate, activity_controller.validationBodyRules.forCreating, activity_controller.checkRules, activity_controller.createActivity);
routerActivities.patch('/activity/:activityId', activityFormCheck.forCreate, activity_controller.validationBodyRules.forUpdating, activity_controller.checkRules, activity_controller.updateActivity);
routerActivities.patch('/activity/:activityId/activation', activityFormCheck.forActivate, activity_controller.validationBodyRules.forActivation, activity_controller.checkRules, activity_controller.activateActivity);
routerActivities.delete('/activity/:activityId',  activity_controller.deleteActivity);


export { routerActivities };