import express from 'express';
import { feedback_controller } from '../controller/feedback_controller.js';

const Router = express.Router;
const routerFeedbaks = new Router();

//  ### Feedbaks

routerFeedbaks.post('/feedback', feedback_controller.createFeedback);
routerFeedbaks.patch('/feedback/:feedbackId', feedback_controller.updateFeedback);
routerFeedbaks.patch('/feedback/:feedbackId/activation', feedback_controller.activateFeedback);
routerFeedbaks.delete('/feedback/:feedbackId', feedback_controller.deleteFeedback);
routerFeedbaks.get('/feedbacks', feedback_controller.getFeedbacks);

export { routerFeedbaks };