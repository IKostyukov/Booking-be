import { messagemodel } from '../models/message_model.js';
import { user } from '../models/user_model.js';
import { messagethreadmodel } from '../models/messagethread_model.js';

import { validationResult } from 'express-validator';
import  i18n   from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from'../enums/http_status_codes_enums.js';


class MessageController {

    validationSchema = {

        messageId: {
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: messageId => {
                    return messageId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'messageId')},       
                bail: true,             
            },
            custom: {
                options:  (messageId, { req, location, path}) => {   
                            
                    return messagemodel.isExist(messageId).then( is_exist => {
                        console.log(is_exist, '-------> is_exist message from validationSchema')
    
                        if ( is_exist.rows[0].exists !== true) {
                            console.log('Message with message_id = ${messageId} is not in DB (from message_controller.js)')
                            return Promise.reject('404 ' + i18n.__('validation.isExist', `message_id = ${messageId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }
                    }).catch(err => {
                        if (err.error) {
                            const server_error = {
                                "success": false,
                                "error": {
                                    "code" : err.statusCode,
                                    "message" : err.error.message,
                                    },
                                "data": err.data,                                
                                }
                            console.log(server_error, " ------------------> Server Error in validationSchema at message_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        user_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'user_id')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'user_id')},       
                bail: true,             
            },
            custom: {
                options:  (user_id, { req, location, path}) => { 
                    if(req.methods === 'GET'){
                        return true
                    }else{
                        return user.isExist(user_id).then( is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows of user_id from validationSchema')
        
                            if ( is_exist.rows[0].exists == false) {
                                return Promise.reject('404 Error;' + i18n.__('validation.isExist', `user_id = ${user_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code" : err.statusCode,
                                        "message" : err.error.message,
                                        },
                                    "data": err.data,                                
                                    }
                                console.log(server_error, " ------------------> Server Error in validationSchema at message_conrtoller.js")
                                return Promise.reject(server_error)
                            }else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
        },

        messagethread_id: {
            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'messagethread_id')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'messagethread_id')},       
                bail: true,             
            },
            custom: {
                options:  (messagethread_id, { req, location, path}) => { 
                    if(req.methods === 'GET'){
                        return true
                    }else{                          
                        return messagethreadmodel.isExist(messagethread_id).then( is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows in messagethread_id of message from validationSchema')
        
                            if ( is_exist.rows[0].exists == false ) {
                                return Promise.reject('404 Error; ' + i18n.__('validation.isExist', `messagethread_id = ${messagethread_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code" : err.statusCode,
                                        "message" : err.error.message,
                                        },
                                    "data": err.data,                                
                                    }
                                console.log(server_error, " ------------------> Server Error in validationSchema at message_conrtoller.js")
                                return Promise.reject(server_error)
                            }else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
        },

        content: {
            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'content')},
                bail: true,
            },  
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'content')},
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'content')},
                options: {min:1, max:500 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        parent_message_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'parent_message_id')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'parent_message_id')},       
                bail: true,             
            },
            custom: {
                options:  (parent_message_id, { req, location, path}) => {      
                    return messagemodel.isExist(parent_message_id).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows of parent_message_id from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `parent_message_id = ${parent_message_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }
                    }).catch(err => {
                        if (err.error) {
                            const server_error = {
                                "success": false,
                                "error": {
                                    "code" : err.statusCode,
                                    "message" : err.error.message,
                                    },
                                "data": err.data,                 
                                }
                            console.log(server_error, " ------------------> Server Error in validationSchema at message_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };    
                    })
                },
            },
        },

        expiry_date: {
            in: ['body'],
            optional: true,
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'expiry_date')},
                bail: true,
            },
        },

        is_reminder: {
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'is_reminder')},
                bail: true,
            },                
            isBoolean: { 
                errorMessage: () => { return i18n.__('validation.isBoolean', 'is_reminder')},
                bail: true,
            },
        },
        
        next_remind_date: {
            in: ['body'],
            optional: true,
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'next_remind_date')},
                bail: true,
            },
        },

        reminder_frequency_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'reminder_frequency_id')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'reminder_frequency_id')},       
                bail: true,             
            },
            custom: {
                options:  (reminder_frequency_id, { req, location, path}) => {      
                    return messagemodel.isExistReminderFrequency(reminder_frequency_id).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows of reminder_frequency_id from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `reminder_frequency_id = ${reminder_frequency_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }                 
                    }).catch(err => {
                        if (err.error) {
                            const server_error = {
                                "success": false,
                                "error": {
                                    "code" : err.statusCode,
                                    "message" : err.error.message,
                                    },
                                "data": err.data,                 
                                }
                            console.log(server_error, " ------------------> Server Error in validationSchema at message_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };    
                    })
                },
            },
        },
      }

    checkResult(req, res, next)  {
        console.log(" ----> checkResult" ) 
        // console.log(i18n.getLocale(),'------> locale')

        const validation_result = validationResult(req)
        const hasError = !validation_result.isEmpty();
        console.log(hasError, " ----> hasError", validation_result.array(), " ----> validation_result", ) 
        if (hasError) {
            const data = validation_result.errors[0].msg

            if(typeof(data) !== 'object') {
                if (data.startsWith('404')){
                    const param = validation_result.errors[0].param
                    const not_found_error = new Api404Error(param, data)
                    console.log(not_found_error,  ` ----> not_found_error from the messageController.checkResult`) 
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                }else{
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)        
                    console.log(bad_request_error,  ` ----> bad_request_error from the messageController.checkResult`) 
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
                }              
            }else{
                const server_error = data
                console.log(server_error,  ` ----> server_error from the messageController.checkResult`) 
                res.status(server_error.statusCode || 500).json(server_error) 
            }
        }else{
            return next()
        }              
    }

    async createMessage(req, res) {
        try{
            const {user_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id } = req.body
            const new_message = await messagemodel.create(user_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id)
            // {message: new_message, recipients: new_recipients}
            if (new_message.message.rows[0] && new_message.recipients[0].rows[0]) {
                const result = { 
                    success: true,
                    data: " Message successfully created"
                }
                console.log(result, new_message.rows, ' -----> createMessage.rows in createMessage function at message_controller.js')
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error( 'new_message', 'Unhandled Error')
                console.log(result, ' ----> err from createMessage function at message_controller.js')
                res.status(result.statusCode || 500).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in createMessage function at message_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateMessage(req, res) {
        try{
            const message_id = req.params.messageId  // user_id не нужен, так как мы не можем изменить пользователя, написавшего сообщение
            const {messagethread_id, content, parent_message_id, expiry_date, is_reminder, next_remind_date, reminder_frequency_id, mtime = "NOW()"} = req.body
            const updated_message = await messagemodel.update(message_id, messagethread_id, content, parent_message_id, expiry_date, is_reminder, next_remind_date, reminder_frequency_id, mtime)
            if (updated_message.rows[0]) {
                const result = { 
                    success: true,
                    data: " Message successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(result, updated_message.rows, ' -----> updateMessage.rows in updateMessage function at message_controller.js' )
            } else {
                const result = new Api404Error( 'message_id', i18n.__('validation.isExist', `message_id = ${message_id}`)) 
                console.log(result, ' ----> err from updateMessage function at message_controller.js')
                res.status(result.statusCode || 500).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in updateMessage function at message_controller.js ')
            res.status(err.statusCode || 500).json(err) 
        }
    }

    async activateMessage(req, res) {
        try{
            const message_id = req.params.messageId
            const {is_reminder} = req.body
            const activated_message = await messagemodel.activate(message_id, is_reminder)
            if (activated_message.rows.length == 0) {                
                const result = new Api404Error( 'message_id', i18n.__('validation.isExist', `message_id = ${message_id}`)) 
                console.log(result, ` ----> err in activateMessage function with message_id = ${message_id} not exists at message_controller.js;`)
                res.status(result.statusCode || 500).json(result) 
            }else if(activated_message.rows[0].is_reminder == false){
                const result = { 
                    success: true,
                    data: " Message successfully deactivated"
                }
                console.log(result, activated_message.rows, '-----> activated_message.rows in activateMessage function at message_controller.js ')
                res.status(httpStatusCodes.OK || 500).json(success)
            }else if(activated_message.rows[0].is_reminder == true) {
                const result = { 
                    success: true,
                    data: " Message successfully activated"
                }
                console.log(activated_message.rows, '-----> activated_message.rows in activateMessage function at message_controller.js ')
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch(err) {
            console.error({err},  '-----> err in activateMessage function at message_controller.js ')           
            res.status(err.statusCode || 500).json(err)    
        }
    }

    async deleteMessage(req, res) {
        try{
            const message_id = req.params.messageId
            const deleted_message = await messagemodel.delete(message_id)
            if (deleted_message.rows.length !== 0) {
                const result = { 
                    success: true,
                    data: " Message successfully deleted"
                }
                console.log(deleted_message.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_message.rows.length == 0) {
                const result = new Api404Error( 'message_id', i18n.__('validation.isExist', `message_id = ${message_id}`)) 
                console.log(result, ' ----> err in deletemessage function with message_id = ${message_id} not exists at message_controller.js;')
                res.status(result.statusCode || 500).json(result) 
            }
        } catch(err) {
            console.error({err},  '----> err in deleteMessage function at message_controller.js ')
            res.status(err.statusCode || 500).json(err)            
        }     
    }

    async getMessages(req, res) {
        try{    
            const {messagethread_id} = req.body
            console.log(messagethread_id, "messagethread_id")
            const get_messages = await messagemodel.getManyMessages(messagethread_id)
            if (get_messages.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_messages.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)  
            }else {
                const result = new Api404Error( 'messagethread_id', i18n.__('validation.isExist', `messagethread_id = ${messagethread_id}`)) 
                console.log(result, ` -----> err in getMessages function  with messagethread_id = ${messagethread_id} not exists at message_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        }catch(err) {
            console.error({err},  '---->err in getMessages function at message_controller.js ')
            res.status(err.statusCode || 500).json(err)             
        }
    }
   
    async getThreads(req, res) {
        try{    
            const {user_id} = req.body
            console.log(user_id, "user_id")
            const get_messagethreads = await messagemodel.getManyThreads(user_id)
            if (get_messagethreads.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_messagethreads.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)  
            }else {
                const result = new Api404Error( 'user_id', i18n.__('validation.isExist', `user_id = ${user_id}`)) 
                console.log(result, ` -----> err in getThreads function  with user_id = ${user_id} not exists at message_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        }catch(err) {
            console.error({err},  '---->err in getThreads function at message_controller.js ')
            res.status(err.statusCode || 500).json(err)             
        }
    }
}

const message_controller = new MessageController();
export { message_controller }