import express from 'express';
import { message_controller } from '../controller/message_controller.js';
import {messageFormCheck} from '../check_forms/message_form_check.js';
import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerMessages = new Router();

const check_create_form = messageFormCheck.forCreateUpdate
const check_update_form = messageFormCheck.forCreateUpdate
const check_activate_form = messageFormCheck.forActivate
const check_retrieve_messages_form = messageFormCheck.forRetrieve
const check_retrieve_threads_form = messageFormCheck.forRetrieve


const check_schema = checkSchema(message_controller.validationSchema);
const chesk_result = message_controller.checkResult;

//  ### Messages

routerMessages.post('/message', check_create_form, check_schema, chesk_result, message_controller.createMessage);
routerMessages.patch('/message/:messageId', check_update_form, check_schema, chesk_result, message_controller.updateMessage);
routerMessages.patch('/message/:messageId/activation', check_activate_form, check_schema, chesk_result, message_controller.activateMessage);
routerMessages.delete('/message/:messageId', check_schema, chesk_result, message_controller.deleteMessage);
routerMessages.get('/messages', check_retrieve_messages_form, check_schema, chesk_result, message_controller.retrieveMultipleMessages);
routerMessages.get('/messagethreads', check_retrieve_threads_form, check_schema, chesk_result, message_controller.retrieveMultipleThreads);

export { routerMessages };