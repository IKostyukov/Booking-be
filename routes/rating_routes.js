import express from 'express';
import { rating_controller } from '../controller/rating_controller.js';
import {ratingFormCheck} from '../check_forms/rating_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerRatings = new Router();

const check_create_form = ratingFormCheck.forCreateUpdate
const check_update_form = ratingFormCheck.forCreateUpdate
const check_connect_form = ratingFormCheck.forConnect

const check_schema = checkSchema(rating_controller.validationSchema);
const chesk_result = rating_controller.checkResult;

//  ### Ratings

routerRatings.post('/rating', check_create_form, check_schema, chesk_result, rating_controller.addRate);
routerRatings.patch('/rating/:ratingId', check_update_form,  check_schema, chesk_result, rating_controller.updateRate);
routerRatings.delete('/rating/:ratingId', check_schema, chesk_result, rating_controller.deleteRate);
routerRatings.post('/rating/:ratingId/message', check_connect_form,  check_schema, chesk_result, rating_controller.connectRatingToFeedback);

export { routerRatings };