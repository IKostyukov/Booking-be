import express from 'express';
import { booking_controller } from '../controller/booking_controller.js';

const Router = express.Router;
const routerBookings = new Router();

//  ### Bookings

routerBookings.post('/booking', booking_controller.createBooking);
routerBookings.patch('/booking/:bookingId', booking_controller.updateBooking);
routerBookings.patch('/booking/:bookingId/approval', booking_controller.approveBooking);
routerBookings.patch('/booking/:bookingId/cancellation', booking_controller.cancelBooking);
routerBookings.delete('/booking/:bookingId', booking_controller.deleteBooking);
routerBookings.get('/booking/:bookingId', booking_controller.getBooking);
routerBookings.get('/booking', booking_controller.getBookings);

export { routerBookings };