import { feedbackmodel } from '../models/feedback_model.js';
import { providermodel } from '../models/provider_model.js';
import { messagethreadmodel } from '../models/messagethread_model.js';


import { validationResult } from 'express-validator';
import  i18n   from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from'../enums/http_status_codes_enums.js';


class FeedbackController {
    validationSchema = {

        feedbackId: {
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: feedbackId => {
                    return feedbackId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'feedbackId')},       
                bail: true,             
            },
            custom: {
                options:  (feedbackId, { req, location, path}) => {   
                            
                    return feedbackmodel.isExist(feedbackId).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows in feedbackId of feedback from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            // console.log('Feedback with feedback_id = ${feedbackId} is not in DB (from feedback_controller.js)')
                            return Promise.reject('404 ' + i18n.__('validation.isExist', `feedback_id = ${feedbackId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        provider_id: {

            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'provider_id')},       
                bail: true,             
            },
            custom: {
                options:  (provider_id, { req, location, path}) => {   
                            
                    return providermodel.isExist(provider_id).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows in provider_id of feedback from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            return Promise.reject('404 Error;' + i18n.__('validation.isExist', `provider_id = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
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
                        
                    return messagethreadmodel.isExist(messagethread_id).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows in messagethread_id of feedback from validationSchema')
    
                        if ( is_exist.rows[0].exists == false ) {
                            // console.log('Feedback with messagethread_id = ${messagethread_id} is not in DB (from feedback_controller.js)')
                            return Promise.reject('404 Error; ' + i18n.__('validation.isExist', `messagethread_id = ${messagethread_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        } else {
                            const  provider_id = req.body.provider_id  
                        return feedbackmodel.isUnique(provider_id, messagethread_id).then( is_unique => {
                            console.log(is_unique.rows , '-------> is_unique.rows in feedback from validationSchema')
        
                            if ( is_unique.rows[0].exists == true) {
                                return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & messagethread_id = ${messagethread_id}`));
                            }
                        }).catch(err => {
                                if (err.error) {
                                    const server_error = {
                                        "success": false,
                                        "error": {
                                            "code" : err.statusCode,
                                            "message" : err.error.message,
                                            },
                                        "data": {
                                            "provider_id" : err.data,
                                        }
                                        }
                                    console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
                                    return Promise.reject(server_error)
                                }else {
                                    const msg = err
                                    return Promise.reject(msg)
                                };                        
                            })
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        is_active: {

            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'is_active')},
                bail: true,
            },                
            isBoolean: { 
                errorMessage: () => { return i18n.__('validation.isBoolean', 'is_active')},
                bail: true,
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
                    console.log(not_found_error,  ` ----> not_found_error from the FeedbackController.checkResult`) 
                    res.status(not_found_error.statusCode || 404).json(not_found_error)
                }else{
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)        
                    console.log(bad_request_error,  ` ----> bad_request_error from the FeedbackController.checkResult`) 
                    res.status(bad_request_error.statusCode || 400).json(bad_request_error) 
                }              
            }else{
                const server_error = data
                console.log(server_error,  ` ----> server_error from the FeedbackController.checkResult`) 
                res.status(server_error.statusCode || 500).json(server_error) 
            }
        }else{
            return next()
        }              
    }

    async createFeedback(req, res) {
        try{
            const {provider_id, messagethread_id} = req.body
            const new_feedback = await feedbackmodel.create(provider_id, messagethread_id)
            if (new_feedback.rows[0]) {
                const result = { 
                    success: true,
                    data: " Feedback successfully created"
                }
                console.log(new_feedback.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error( 'provider_id', 'Unhandled Error')
                console.log(result, ' ----> err from createFeedback function at feedback_controller.js')
                res.status(result.statusCode || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in createFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateFeedback(req, res) {
        try{
            const feedback_id = req.params.feedbackId
            const {provider_id, messagethread_id} = req.body
            const updated_feedback = await feedbackmodel.update(feedback_id, provider_id, messagethread_id)
            if (updated_feedback.rows[0]) {
                const result = { 
                    success: true,
                    data: " Feedback successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(updated_feedback.rows, result )
            } else {
                const result = new Api404Error( 'feedback_id', i18n.__('validation.isExist', `feedback_id = ${feedback_id}`)) 
                console.log(result, ' ----> err from updateFeedback function at feedback_controller.js')
                res.status(result.statusCode || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in updateFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err) 
        }
    }

    async activateFeedback(req, res) {
        try{
            const feedback_id = req.params.feedbackId
            const {is_active} = req.body
            const activated_feedback = await feedbackmodel.activate(feedback_id, is_active)
            if (activated_feedback.rows.length == 0) {                
                const result = new Api404Error( 'feedback_id', i18n.__('validation.isExist', `feedback_id = ${feedback_id}`)) 
                console.log(result, ` ----> err in activateFeedback function with feedback_id = ${feedback_id} not exists at feedback_controller.js;`)
                res.status(result.statusCode || 404).json(result) 
            }else if(activated_feedback.rows[0].active == false){
                const result = { 
                    success: true,
                    data: " Feedback successfully deactivated"
                }
                console.log(activated_feedback.rows, result)
                res.status(httpStatusCodes.OK || 200).json(success)
            }else if(activated_feedback.rows[0].active == true) {
                const result = { 
                    success: true,
                    data: " Feedback successfully activated"
                }
                console.log(activated_feedback.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            }
        } catch(err) {
            console.error({err},  '-----> err in activateFeedback function at feedback_controller.js ')           
            res.status(err.statusCode || 500).json(err)    
        }
    }

    async deleteFeedback(req, res) {
        try{
            const feedback_id = req.params.feedbackId
            const deleted_feedback = await feedbackmodel.delete(feedback_id)
            if (deleted_feedback.rows.length !== 0) {
                const result = { 
                    success: true,
                    data: " Feedback successfully deleted"
                }
                console.log(deleted_feedback.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_feedback.rows.length == 0) {
                const result = new Api404Error( 'feedback_id', i18n.__('validation.isExist', `feedback_id = ${feedback_id}`)) 
                console.log(result, ' ----> err in deleteFeedback function with feedback_id = ${feedback_id} not exists at feedback_controller.js;')
                res.status(result.statusCode || 400).json(result) 
            }
        } catch(err) {
            console.error({err},  '----> err in deleteFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)            
        }
    }

    async getFeedbacks(req, res) {
        try{    
            const {provider_id} = req.body
            console.log(provider_id, "provider_id")
            const get_feedbacks = await feedbackmodel.getMany(provider_id)
            if (get_feedbacks.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_feedbacks.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)  
            }else {
                const result = new Api404Error( 'provider_id', i18n.__('validation.isExist', `provider_id = ${provider_id}`)) 
                console.log(result, ` -----> err in getFeedbacks function  with provider_id = ${provider_id} not exists at feedback_controller.js;`)
                res.status(result.statusCode || 400).json(result)
            }
        }catch(err) {
            console.error({err},  '---->err in getFeedbacks function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)             
        }
    }
   
    
}

const feedback_controller = new FeedbackController();
export { feedback_controller }