import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {equipment_controller} from '../controller/equipment_controller.js';
import { user_controller } from '../controller/user_controller.js';
import { provider_controller } from '../controller/provider_controller.js';
import { service_controller } from '../controller/service_controller.js';
import { booking_controller } from '../controller/booking_controller.js';
import { advantage_controller } from '../controller/advantage_controller.js';
const Router = express.Router;
const router = new Router()

//  ### Advantage

router.post('/advantage', advantage_controller.createAdvantage);
router.patch('/advantage/:id', advantage_controller.updateAdvantage);
router.patch('/advantage/:id/activation', advantage_controller.activateAdvantage);
router.delete('/advantage/:id', advantage_controller.deleteAdvantage);
router.get('/advantage/:id', advantage_controller.getAdvantage);
router.get('/advantage', advantage_controller.getAdvantages);


//  ### Provider

router.post('/provider', provider_controller.createProvider);
router.patch('/provider/:id/activation', provider_controller.activateProvider);
router.patch('/provider/:id', provider_controller.updateProvider);
router.delete('/provider/:id', provider_controller.deleteProvider);
router.get('/provider/:id', provider_controller.getProvider);
router.get('/provider', provider_controller.getProviders);
router.get('/bestProviders', provider_controller.getBestProviders);

                //Provider's descriptions
router.post('/provider/:id/description', provider_controller.createDescription);
router.patch('/provider/:id/description', provider_controller.updateDescription);
router.delete('/provider/:id/description', provider_controller.deleteDescription);
router.get('/provider/:id/description/:id', provider_controller.getDescription);
router.get('/provider/:id/descriptions', provider_controller.getAllDescriptions);

                //Provider's services
router.patch('/provider/:id/services', provider_controller.addServicesToProvider);
router.get('/provider/:id/services', provider_controller.getServicesOfProvider);

                //Provider's advantages
router.post('/provider/:providerId/advantage/:advantageId', provider_controller.addAdvantageToProvider);
router.delete('/provider/:providerId/advantage/:advantageId', provider_controller.deleteAdvantageFromProvider);

//  ### Services

router.post('/service', service_controller.createService);
router.patch('/service/:id/activation', service_controller.activateService);
router.patch('/service/:id', service_controller.updateService);
router.delete('/service/:id', service_controller.deleteService);
router.get('/service/:id', service_controller.getService);
router.get('/service', service_controller.getServices);

//  ### Activivies

router.post('/activity', activity_controller.createActivity);
router.patch('/activity/:id', activity_controller.updateActivity);
router.patch('/activity/:id/activation', activity_controller.activateActivity);
router.delete('/activity/:id', activity_controller.deleteActivity);
router.get('/activity/:id', activity_controller.getActivity);
router.get('/activities', activity_controller.getActivities);
router.get('/popularActivities', activity_controller.getPopularActivities);

//  ### Equipment

router.post('/equipment', equipment_controller.createEquipment);
router.patch('/equipment/:id', equipment_controller.updateEquipment);
router.patch('/equipment/:id/activation', equipment_controller.activateEquipment);
router.delete('/equipment/:id', equipment_controller.deleteEquipment);
router.get('/equipment/:id', equipment_controller.getEquipment);
router.get('/equipments', equipment_controller.getEquipments);

//  ### Equipment of provider

router.post('/equipmentprovider', provider_controller.createEquipmentProvider);
router.patch('/equipmentprovider/:id/activation', provider_controller.activateEquipmentProvider);
router.patch('/equipmentprovider/:id', provider_controller.updateEquipmentProvider);
router.delete('/equipmentprovider/:id', provider_controller.deleteEquipmentProvider);
router.get('/equipmentprovider/:id', provider_controller.getOneEquipmentProvider);
router.get('/equipmentprovider', provider_controller.getAllEquipmentProvider);

//  ### Fares 

router.post('/fare', provider_controller.createFare);
router.patch('/fare/:id', provider_controller.updateFare);
router.delete('/fare/:id', provider_controller.deleteFare);
router.get('/fare/:id', provider_controller.getFare);
router.get('/provider/:id/equipmentprovider/:id/fare', provider_controller.getFares);

//  ### Promotions

router.post('/promotion', provider_controller.createPromotion);
router.patch('/promotion/:id', provider_controller.updatePromotion);
router.patch('/provider/:providerId/equipmentprovider/:equipmentproviderId/promotion/:promotionId/activation', provider_controller.activatePromotion);
router.delete('/provider/:providerId/equipmentprovider/:equipmentproviderId/promotion/:promotionId', provider_controller.deletePromotion);
router.get('/provider/:id/equipmentprovider/:id/promotion/:id', provider_controller.getOnePromotion);
router.get('/provider/:id/equipmentprovider/:id/promotion', provider_controller.getAllPromotions);


//  ### Timetable

router.post('/timetable', provider_controller.createTimetable);
router.patch('/timetable/:id', provider_controller.updateTimetable);
router.delete('/timetable/:id', provider_controller.deleteTimetable);
router.get('/timetable/:id', provider_controller.getTimetable);

//  ### Extratimetable

router.post('/extratimetable', provider_controller.createExtratimetable);
router.patch('/extratimetable/:id', provider_controller.updateExtratimetable);
router.delete('/extratimetable/:id', provider_controller.deleteExtratimetable);
router.get('/extratimetable/:id', provider_controller.getOneExtratimetable);
router.get('/extratimetable', provider_controller.getAllExtratimetable);

//  ### Booking

router.post('/provider/:providerId/booking', booking_controller.createBooking);
router.patch('/provider/:providerId/booking/:bookingId', booking_controller.updateBooking);
router.patch('/provider/:providerId/booking/:bookingId/approval', booking_controller.approveBooking);
router.patch('/provider/:providerId/booking/:bookingId/cancellation', booking_controller.cancelBooking);
router.delete('/provider/:providerId/booking/:bookingId', booking_controller.deleteBooking);
router.get('/equipmentprovider/:equipmentproviderId/booking/:bookingId', booking_controller.getBooking);
router.get('/equipmentprovider/:equipmentproviderId/booking', booking_controller.getBookings);

//  ### Users

router.post('/user', user_controller.createUser);
router.post('/user/:id', user_controller.updateUser);
router.post('/user/:id/activation', user_controller.activateUser);
router.delete('/user/:id', user_controller.deleteUser);
router.get('/user/:id', user_controller.getUser);
router.get('/users', user_controller.getUsers);
router.post('/user/:userId/favoritequioment/:equipmentproviderId', user_controller.addFavoriteEquipment);
router.delete('/user/:userId/favoritequioment/:equipmentproviderId', user_controller.deleteFavoriteEquipment);
router.get('/user/:userId/favoritequioment', user_controller.getFavoriteEquipment);




//  Searches

router.get('/searchEquipment', equipment_controller.getSearchEquipment);


//  Тесты ##########

router.get('/', function(req, res) {
    res.send('Birds home page');
});
//  -----------

export {router};