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
router.patch('/provider/description/:id', recipient_controller.updateDescription);
router.delete('/provider/description/:id', recipient_controller.deleteDescription);




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

router.post('/createFare', recipient_controller.createFare);
router.patch('/fare/:id', recipient_controller.updateFare);
router.delete('/fare/:id', recipient_controller.deleteFare);

//  ### Timetable

router.post('/createTimetable', recipient_controller.createTimetable);
router.patch('/timetable/:id', recipient_controller.updateTimetable);
router.delete('/timetable/:id', recipient_controller.deleteTimetable);

//  ### Extratimetable

router.post('/createExtratimetable', recipient_controller.createExtratimetable);
router.patch('/extratimetable/:id', recipient_controller.updateExtratimetable);
router.delete('/extratimetable/:id', recipient_controller.deleteExtratimetable);


//  ### Users

router.post('/createUser', user_controller.createUser );
router.post('/updateUser', user_controller.updateUser );
router.post('/activateUser', user_controller.activateUser );
router.delete('/deleteUser', user_controller.deleteUser );
router.get('/getUser', user_controller.getUser );
router.get('/getUsers', user_controller.getUsers);


//  ### Activivies

router.post('/createActivity', activity_controller.createActivity);
router.post('/updateActivity', activity_controller.updateActivtiy);
router.post('/activateActivtiy', activity_controller.activateActivtiy);
router.delete('/deleteActivity', activity_controller.deleteActivity);
router.get('/getActivity', activity_controller.getActivity);
router.get('/getActivities', activity_controller.getActivities);
router.get('/popularActivities', activity_controller.getPopularActivities);

//  Equipment

router.post('/createEquipment', equipment_controller.createEquipment);
router.post('/updateEquipment', equipment_controller.updateEquipment);
router.post('/equipment/:id/activation', equipment_controller.activateEquipment);
router.delete('/deleteEquipment', equipment_controller.deleteEquipment);
router.get('/getEquipment', equipment_controller.getEquipment);
router.get('/getEquipments', equipment_controller.getEquipments);
router.get('/searchEquipment', equipment_controller.getSearchEquipment);


//  Тесты ##########

router.get('/', function(req, res) {
    res.send('Birds home page');
});
//  -----------

export {router};