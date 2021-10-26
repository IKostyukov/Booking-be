import express from 'express';
import {activity_controller} from '../controller/activity_controller.js';
import {equipment_controller} from '../controller/equipment_controller.js';
import { user_controller } from '../controller/user_controller.js';
import { recipient_controller } from '../controller/recipient_controller.js';
import { service_controller } from '../controller/service_controller.js';
const Router = express.Router;
const router = new Router();


//  ### Services

router.post('/service', service_controller.createService);
router.patch('/service/:id', service_controller.updateService);
router.patch('/service/:id/activation', service_controller.activateService);
router.delete('/service/:id', service_controller.deleteService);

//  ### Equipment provider

router.post('/equipmentprovider', recipient_controller.createEquipmentProvider);
router.patch('/equipmentprovider/:id', recipient_controller.updateEquipmentProvider);
router.patch('/equipmentprovider/:id/activation', recipient_controller.activateEquipmentProvider);
router.delete('/equipmentprovider/:id', recipient_controller.deleteEquipmentProvider);

//  ### Fares 

router.post('/createFare', recipient_controller.createFare);
router.patch('/fare/:id', recipient_controller.updateFare);
router.delete('/fare/:id', recipient_controller.deleteFare);

//  ### Timetable

router.post('/createTimetable', recipient_controller.createTimetable);
router.patch('/timetable/:id', recipient_controller.updateTimetable);
router.delete('/timetable/:id', recipient_controller.deleteTimetable);


//  ### Extrftimetable

router.post('/createExtratimetable', recipient_controller.createExtratimetable);
router.patch('/extratimetable/:id', recipient_controller.updateExtratimetable);
router.delete('/extratimetable/:id', recipient_controller.deleteExtratimetable);





router.post('/createDescription', recipient_controller.createDescription);
router.post('/addService', recipient_controller.addService);


//  ### Provider

router.post('/createRecipient', recipient_controller.createRecipient);
router.get('/bestRecipientsOfServices', recipient_controller.getBestRecipients);



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
router.post('/activateEquipment', equipment_controller.activateEquipment);
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