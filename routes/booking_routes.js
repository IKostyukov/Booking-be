import express from 'express';
import { booking_controller } from '../controller/booking_controller.js';
import {bookingFormCheck} from '../check_forms/booking_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerBookings = new Router();

const check_create_form = bookingFormCheck.forCreateUpdate
const check_update_form = bookingFormCheck.forCreateUpdate
const check_retrieve_form = bookingFormCheck.forRetrieve

const check_schema = checkSchema(booking_controller.validationSchema);
const chesk_result = booking_controller.checkResult;



//  ### Bookings

routerBookings.post('/booking', check_create_form,  check_schema, chesk_result, booking_controller.createBooking);
routerBookings.patch('/booking/:bookingId', check_update_form,  check_schema, chesk_result, booking_controller.updateBooking);
routerBookings.patch('/booking/:bookingId/approval', check_schema, chesk_result, booking_controller.approveBooking);
routerBookings.patch('/booking/:bookingId/cancellation', check_schema, chesk_result, booking_controller.cancelBooking);
routerBookings.delete('/booking/:bookingId', check_schema, chesk_result, booking_controller.deleteBooking);
routerBookings.get('/booking/:bookingId', check_schema, chesk_result, booking_controller.retrieveSingleBooking);
routerBookings.get('/booking', check_retrieve_form, check_schema, chesk_result, booking_controller.retrieveMultipleBookings);

export { routerBookings };