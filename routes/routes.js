import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {equipment_controller} from '../controller/equipment_controller.js';
import { user_controller } from '../controller/user_controller.js';
import { provider_controller } from '../controller/provider_controller.js';
import { service_controller } from '../controller/service_controller.js';
const Router = express.Router;
const router = new Router()



//  ### Provider

router.post('/provider', provider_controller.createProvider);
router.patch('/provider/:id/activation', provider_controller.activateProvider);
router.patch('/provider/:id', provider_controller.updateProvider);
router.delete('/provider/:id', provider_controller.deleteProvider);
router.get('/provider/:id', provider_controller.getProvider);
router.get('/provider', provider_controller.getProviders);
router.get('/bestProviders', provider_controller.getBestProviders);
router.post('/provider/:id/services', provider_controller.addServicesToProvider);
router.patch('/provider/:id/services', provider_controller.updateServicesOfProvider);
router.post('/provider/:id/description', provider_controller.createDescription);
router.patch('/provider/:id/description', provider_controller.updateDescription);
router.delete('/provider/:id/description', provider_controller.deleteDescription);
router.get('/provider/:id/description/:id', provider_controller.getDescription);
router.get('/provider/:id/descriptions', provider_controller.getAllDescriptions);


//  ### Services

router.post('/service', service_controller.createService);
router.patch('/service/:id/activation', service_controller.activateService);
router.patch('/service/:id', service_controller.updateService);
router.delete('/service/:id', service_controller.deleteService);

//  ### Equipment provider

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


//  ### Timetable

router.post('/timetable', provider_controller.createTimetable);
router.patch('/timetable/:id', provider_controller.updateTimetable);
router.delete('/timetable/:id', provider_controller.deleteTimetable);
router.get('/timetable/:id', provider_controller.getTimetable);


//  ### Extratimetable

router.post('/extratimetable', provider_controller.createExtratimetable);
router.patch('/extratimetable/:id', provider_controller.updateExtratimetable);
router.get('/extratimetable/:id', provider_controller.getOneExtratimetable);
router.get('/extratimetable', provider_controller.getAllExtratimetable);


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