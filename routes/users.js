import express from 'express';
import { user_controller } from '../controller/user_controller.js';

const Router = express.Router;
const routerUsers = new Router();

//  ### Users ###

routerUsers.post('/user', user_controller.createUser);
routerUsers.post('/user/:userId', user_controller.updateUser);
routerUsers.post('/user/:userId/activation', user_controller.activateUser);
routerUsers.delete('/user/:userId', user_controller.deleteUser);
routerUsers.get('/user/:userId', user_controller.getUser);
routerUsers.get('/users', user_controller.getUsers);

// User's favorit equipment
routerUsers.post('/user/:userId/favorite/equipment/:equipmentId', user_controller.addFavoriteEquipment);
routerUsers.delete('/user/:userId/favorite/equipment/:equipmentId', user_controller.deleteFavoriteEquipment);
routerUsers.get('/user/:userId/favorite/equipment', user_controller.getFavoriteEquipment);


export { routerUsers };