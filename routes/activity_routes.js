import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {activityFormCheck} from '../check_forms/activity_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerActivities = new Router();

const check_create_form = activityFormCheck.forCreateUpdate
const check_update_form = activityFormCheck.forCreateUpdate
const check_activate_form = activityFormCheck.forActivate
const check_retrieve_form = activityFormCheck.forRetrieve

const check_schema = checkSchema(activity_controller.validationSchema);
const chesk_result = activity_controller.checkResult;

// ### Activities

routerActivities.get('/activity/:activityId', check_schema, chesk_result, activity_controller.retrieveSingleActivity);
routerActivities.get('/activities', check_retrieve_form, check_schema, chesk_result, activity_controller.retrieveMultipleActivities);
routerActivities.get('/activities/popular', activity_controller.retrievePopularActivities);
routerActivities.post('/activity', check_create_form, check_schema, chesk_result, activity_controller.createActivity);
routerActivities.patch('/activity/:activityId', check_update_form, check_schema, chesk_result, activity_controller.updateActivity);
routerActivities.patch('/activity/:activityId/activation', check_activate_form, check_schema, chesk_result, activity_controller.activateActivity);
routerActivities.delete('/activity/:activityId', check_schema, chesk_result, activity_controller.deleteActivity);

 // tests
// routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, activity_controller.validationRules.forActivation,  activity_controller.checkRules, activity_controller.activateActivity);
// routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, check_schema, chesk_result, activity_controller.activateActivity);


export { routerActivities };