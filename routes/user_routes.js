import express from 'express';
import { user_controller } from '../controller/user_controller.js';
import { userFormCheck } from '../check_forms/user_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerUsers = new Router();

const check_create_form = userFormCheck.forCreateUpdate
const check_update_form = userFormCheck.forCreateUpdate
const check_activate_form = userFormCheck.forActivate
const check_retrieve_form = userFormCheck.forRetrieve
const check_retrieve_equipment_form = userFormCheck.forRetrieveUsersEquipment

const check_schema = checkSchema(user_controller.validationSchema);
const chesk_result = user_controller.checkResult;


//  ### Users ###

routerUsers.post('/user', check_create_form, check_schema, chesk_result, user_controller.createUser);
routerUsers.patch('/user/:userId', check_update_form, check_schema, chesk_result, user_controller.updateUser);
routerUsers.patch('/user/:userId/activation', check_activate_form, check_schema, chesk_result, user_controller.activateUser);
routerUsers.delete('/user/:userId', check_schema, chesk_result, user_controller.deleteUser);
routerUsers.get('/user/:userId', user_controller.retrieveSingleUserWithRoles);
routerUsers.get('/users', check_retrieve_form, check_schema, chesk_result, user_controller.retrieveMultipleUsers);

// User's favorit equipment
routerUsers.post('/user/:userId/favorite/equipment/:equipmentId', check_schema, chesk_result, user_controller.addFavoriteEquipment);
routerUsers.delete('/user/:userId/favorite/equipment/:equipmentId', check_schema, chesk_result, user_controller.deleteFavoriteEquipment);
routerUsers.get('/user/:userId/favorite/equipment', check_retrieve_equipment_form, check_schema, chesk_result, user_controller.retrieveFavoriteEquipment);


export { routerUsers };