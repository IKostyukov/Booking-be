import express from 'express';
import { message_controller } from '../controller/message_controller.js';

const Router = express.Router;
const routerMessages = new Router();

//  ### Messages

routerMessages.post('/message', message_controller.createMessage);
routerMessages.patch('/message/:messageId', message_controller.updateMessage);
routerMessages.patch('/message/:messageId/activation', message_controller.activateMessage);
routerMessages.delete('/message/:messageId', message_controller.deleteMessage);
routerMessages.get('/messages', message_controller.getMessages);
routerMessages.get('/messagethreads', message_controller.getThreads);

export { routerMessages };