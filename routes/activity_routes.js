import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {activityFormCheck} from '../check_forms/activity_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerActivities = new Router();

const check_create_form = activityFormCheck.forCreateUpdateGetAll
const check_update_form = activityFormCheck.forCreateUpdateGetAll
const check_activate_form = activityFormCheck.forActivate
const check_get_form = activityFormCheck.forCreateUpdateGetAll

const check_schema = checkSchema(activity_controller.validationSchema);
const chesk_result = activity_controller.checkResult;


// ### Activities

routerActivities.get('/activity/:activityId', check_schema, chesk_result, activity_controller.getActivity);
routerActivities.get('/activities', check_get_form,  check_schema, chesk_result, activity_controller.getActivities);
routerActivities.get('/activities/popular', activity_controller.getPopularActivities);
routerActivities.post('/activity', check_create_form, check_schema, chesk_result, activity_controller.createActivity);
routerActivities.patch('/activity/:activityId', check_update_form, check_schema, chesk_result, activity_controller.updateActivity);
routerActivities.patch('/activity/:activityId/activation', check_activate_form, check_schema, chesk_result, activity_controller.activateActivity);
routerActivities.delete('/activity/:activityId', check_schema, chesk_result, activity_controller.deleteActivity);

 // tests
// routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, activity_controller.validationRules.forActivation,  activity_controller.checkRules, activity_controller.activateActivity);
// routerActivities.patch('/activity/:activityId/activation', activityFormCheck.isActive, check_schema, chesk_result, activity_controller.activateActivity);


export { routerActivities };