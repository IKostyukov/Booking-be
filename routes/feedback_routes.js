import express from 'express';
import { feedback_controller } from '../controller/feedback_controller.js';
import { feedbackFormCheck } from '../check_forms/feedback_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerFeedbaks = new Router();

const check_create_form = feedbackFormCheck.forCreateUpdate
const check_update_form = feedbackFormCheck.forCreateUpdate
const check_activate_form = feedbackFormCheck.forActivate
const check_retrieve_form = feedbackFormCheck.forRetrieve

const check_schema = checkSchema(feedback_controller.validationSchema);
const chesk_result = feedback_controller.checkResult;

//  ### Feedbaks

routerFeedbaks.post('/feedback', check_create_form, check_schema, chesk_result, feedback_controller.createFeedback);
routerFeedbaks.patch('/feedback/:feedbackId', check_update_form, check_schema, chesk_result, feedback_controller.updateFeedback);
routerFeedbaks.patch('/feedback/:feedbackId/activation', check_activate_form, check_schema, chesk_result, feedback_controller.activateFeedback);
routerFeedbaks.delete('/feedback/:feedbackId', check_schema, chesk_result, feedback_controller.deleteFeedback);
routerFeedbaks.get('/feedbacks', check_retrieve_form, check_schema, chesk_result, feedback_controller.retrieveMultipleFeedbacks);

export { routerFeedbaks };