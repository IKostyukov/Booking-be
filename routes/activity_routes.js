import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {activityFormCheck} from '../Check_forms/activity_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerActivities = new Router();

// ### Activities

routerActivities.get('/activity/:activityId', checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.getActivity);
routerActivities.get('/activities',activityFormCheck.isName,  checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.getActivities);
routerActivities.get('/activities/popular', activity_controller.getPopularActivities);
routerActivities.post('/activity', activityFormCheck.isName, checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.createActivity);
routerActivities.patch('/activity/:activityId', activityFormCheck.isName, checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.updateActivity);
routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.activateActivity);
routerActivities.delete('/activity/:activityId', checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.deleteActivity);

 // tests
// routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, activity_controller.validationRules.forActivation,  activity_controller.checkRules, activity_controller.activateActivity);
// routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, checkSchema(activity_controller.registrationSchema), activity_controller.checkResult, activity_controller.activateActivity);


export { routerActivities };