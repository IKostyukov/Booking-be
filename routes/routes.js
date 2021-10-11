import express from 'express';
import {controller} from '../controller/controller.js';
const Router = express.Router;
const router = new Router();

router.get('/bestRecreationalFacilities', controller.getBestFacilities);
router.get('/popularActivities', controller.getPopularActivities);
router.get('/searchEquipment', controller.getSearchEquipment);

router.post('/createUser', controller.createUser );
router.post('/updateUser', controller.updateUser );
router.post('/activateUser', controller.activateUser );
router.delete('/deleteUser', controller.deleteUser );
router.get('/getUser', controller.getUser );
router.get('/getUsers', controller.getUsers);


router.post('/createActivity', controller.createActivity);
router.post('/updateActivity', controller.updateActivtiy);
router.post('/activateActivtiy', controller.activateActivtiy);
router.delete('/deleteActivity', controller.deleteActivity);
router.get('/getActivity', controller.getActivity);
router.get('/getActivities', controller.getActivities);


//  Тесты ##########
router.post('/test',  controller.doPost)
router.get('/', function(req, res) {
    res.send('Birds home page');
});
//  -----------

export {router};