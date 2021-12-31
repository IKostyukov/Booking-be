import express from 'express';
import { rating_controller } from '../controller/rating_controller.js';

const Router = express.Router;
const routerRatings = new Router();

//  ### Ratings

routerRatings.post('/rating', rating_controller.addRate);
routerRatings.patch('/rating/:ratingId', rating_controller.updateRate);
routerRatings.delete('/rating/:ratingId', rating_controller.deleteRate);
routerRatings.post('/rating/:ratingId/message', rating_controller.connectRatingToFeedback);

export { routerRatings };