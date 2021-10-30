import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {equipment_controller} from '../controller/equipment_controller.js';
import { user_controller } from '../controller/user_controller.js';
import { recipient_controller } from '../controller/recipient_controller.js';
import { service_controller } from '../controller/service_controller.js';
const Router = express.Router;
const router = new Router();

//  ### Provider

router.post('/provider', recipient_controller.createRecipient);
router.patch('/provider/:id/activation', recipient_controller.activateProvider);
router.patch('/provider/:id', recipient_controller.updateProvider);
router.delete('/provider/:id', recipient_controller.deleteProvider);
router.get('/provider/:id', recipient_controller.getProvider);
router.get('/providers', recipient_controller.getProviders);
router.get('/bestProviders', recipient_controller.getBestRecipients);
router.post('/provider/:id/services', recipient_controller.addServicesToProvider);
router.patch('/provider/:id/services', recipient_controller.updateServicesOfProvider);
router.post('/provider/:id/description', recipient_controller.createDescription);
router.patch('/provider/:id/description', recipient_controller.updateDescription);
router.delete('/provider/:id/description', recipient_controller.deleteDescription);

//  ### Services

router.post('/service', service_controller.createService);
router.patch('/service/:id/activation', service_controller.activateService);
router.patch('/service/:id', service_controller.updateService);
router.delete('/service/:id', service_controller.deleteService);

//  ### Equipment provider

router.post('/equipmentprovider', recipient_controller.createEquipmentProvider);
router.patch('/equipmentprovider/:id/activation', recipient_controller.activateEquipmentProvider);
router.patch('/equipmentprovider/:id', recipient_controller.updateEquipmentProvider);
router.delete('/equipmentprovider/:id', recipient_controller.deleteEquipmentProvider);

//  ### Fares 

router.post('/fare', recipient_controller.createFare);
router.patch('/fare/:id', recipient_controller.updateFare);
router.delete('/fare/:id', recipient_controller.deleteFare);

//  ### Timetable

router.post('/timetable', recipient_controller.createTimetable);
router.patch('/timetable/:id', recipient_controller.updateTimetable);
router.delete('/timetable/:id', recipient_controller.deleteTimetable);

//  ### Extratimetable

router.post('/extratimetable', recipient_controller.createExtratimetable);
router.patch('/extratimetable/:id', recipient_controller.updateExtratimetable);
router.delete('/extratimetable/:id', recipient_controller.deleteExtratimetable);


//  ### Users

router.post('/user', user_controller.createUser );
router.post('/user/:id', user_controller.updateUser );
router.post('/user/:id/activation', user_controller.activateUser );
router.delete('/user/:id', user_controller.deleteUser );
router.get('/user/:id', user_controller.getUser );
router.get('/users', user_controller.getUsers);


//  ### Activivies

router.post('/activity', activity_controller.createActivity);
router.patch('/activity/:id', activity_controller.updateActivtiy);
router.patch('/activity/:id/activation', activity_controller.activateActivtiy);
router.delete('/activity/:id', activity_controller.deleteActivity);
router.get('/activity/:id', activity_controller.getActivity);
router.get('/activities', activity_controller.getActivities);
router.get('/popularActivities', activity_controller.getPopularActivities);

//  Equipment

router.post('/equipment', equipment_controller.createEquipment);
router.patch('/equipment/:id', equipment_controller.updateEquipment);
router.patch('/equipment/:id/activation', equipment_controller.activateEquipment);
router.delete('/equipment/:id', equipment_controller.deleteEquipment);
router.get('/equipment/:id', equipment_controller.getEquipment);
router.get('/equipments', equipment_controller.getEquipments);

//  Searches

router.get('/searchEquipment', equipment_controller.getSearchEquipment);


//  Тесты ##########

router.get('/', function(req, res) {
    res.send('Birds home page');
});
//  -----------

export {router};