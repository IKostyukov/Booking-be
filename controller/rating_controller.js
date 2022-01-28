import { ratingmodel } from '../models/rating_model.js';
import { providermodel } from '../models/provider_model.js';
import { user } from '../models/user_model.js';

import { validationResult } from 'express-validator';
import  i18n   from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from'../enums/http_status_codes_enums.js';
import { messagemodel } from '../models/message_model.js';


class RatingController {

    validationSchema = {

        ratingId: {
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: ratingId => {
                    return ratingId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'ratingId')},       
                bail: true,             
            },
            custom: {
                options:  (ratingId, { req, location, path}) => {                               
                    return ratingmodel.isExist(ratingId).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows of rating from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            console.log('Rating with rating_id = ${ratingId} is not in DB (from rating_controller.js)')
                            return Promise.reject('404 Error; ' + i18n.__('validation.isExist', `rating_id = ${ratingId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at rating_conrtoller.js")
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
            optional: true,
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
                        console.log(is_exist.rows, '-------> is_exist.rows of provider from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            console.log('Rating with provider_id = ${provider_id} is not in DB (from rating_controller.js)')
                            return Promise.reject('404 Error;  ' + i18n.__('validation.isExist', `provider_id = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at rating_controller.js")
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
                    return user.isExist(user_id).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows of user_id from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            console.log('Feedback with user_id = ${user_id} is not in DB (from feedback_controller.js)')
                            return Promise.reject('404 Error;' + i18n.__('validation.isExist', `user_id = ${user_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }else{
                            const  provider_id = req.body.provider_id  
                            return ratingmodel.isUnique(provider_id, user_id).then( is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows of rating from validationSchema')
        
                                if ( is_unique.rows[0].exists == true) {
                                    return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & user_id = ${user_id}`));
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

        clearness: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'clearness')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'clearness')},       
                bail: true,             
            },
        },

        staff: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'staff')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'staff')},       
                bail: true,             
            },
        },

        view: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'view')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'view')},       
                bail: true,             
            },
        },
        message_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'view')},
                bail: true,
            },
            isInt: { 
                errorMessage: () => { return i18n.__('validation.isInt', 'view')},       
                bail: true,             
            },

            custom: {
                options:  (message_id, { req, location, path}) => {      
                    return messagemodel.isExist(message_id).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows of user_id from validationSchema')
    
                        if ( is_exist.rows[0].exists == false) {
                            console.log('Feedback with message_id = ${message_id} is not in DB (from feedback_controller.js)')
                            return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `message_id = ${message_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }else{
                            const rating_id = req.params.ratingId   
                            return ratingmodel.isUniqeuRatingAndMessage(message_id, rating_id).then( is_unique => {
                                console.log(is_unique.rows, '-------> is_unique.rows of message_id from validationSchema')
            
                                if ( is_unique.rows[0].exists == false) {
                                    return Promise.reject( i18n.__('validation.isUniqueCombination', `message_id = ${message_id} & rating_id =${rating_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                    console.log(not_found_error,  ` ----> not_found_error from the RatingController.checkResult`) 
                    res.status(not_found_error.statusCode || 404).json(not_found_error)
                }else{
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)        
                    console.log(bad_request_error,  ` ----> bad_request_error from the RatingController.checkResult`) 
                    res.status(bad_request_error.statusCode || 400).json(bad_request_error) 
                }              
            }else{
                const server_error = data
                console.log(server_error,  ` ----> server_error from the RatingController.checkResult`) 
                res.status(server_error.statusCode || 500).json(server_error) 
            }
        }else{
            return next()
        }              
    }

    async addRate(req, res) {
        try{    
            const {provider_id, user_id, clearness, staff, view } = req.body
            const new_rating = await ratingmodel.add(provider_id, user_id, clearness, staff, view )
            if (new_rating.rows[0]) {
                const result = { 
                    success: true,
                    data: " Rating successfully created"
                }
                console.log(new_rating.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error( 'provider_id', 'Unhandled Error')
                console.log(result, ' ----> err from addRate function at rating_controller.js')
                res.status(result.statusCode || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in addRate function at rating_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateRate(req, res) {
        try{    
            const rating_id = req.params.ratingId
            const {provider_id, user_id, clearness, staff, view } = req.body
            const updated_rating = await ratingmodel.update(rating_id, provider_id, user_id, clearness, staff, view )
            if (updated_rating.rows[0]) {
                const result = { 
                    success: true,
                    data: " Rating successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(updated_rating.rows, result )
            } else {
                const result = new Api404Error( 'rating_id', i18n.__('validation.isExist', `rating_id = ${rating_id}`)) 
                console.log(result, ' ----> err from updateRate function at rating_controller.js')
                res.status(result.statusCode || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in updateRate function at rating_controller.js ')
            res.status(err.statusCode || 500).json(err) 
        }
    }    

    async deleteRate(req, res) {
        try{    
            const rating_id = req.params.ratingId
            const deleted_rating = await ratingmodel.delete(rating_id)
            if (deleted_rating.rows.length !== 0) {
                const result = { 
                    success: true,
                    data: " Rating successfully deleted"
                }
                console.log(deleted_rating.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_rating.rows.length == 0) {
                const result = new Api404Error( 'rating_id', i18n.__('validation.isExist', `rating_id = ${rating_id}`)) 
                console.log(result, ' ----> err in deleteRate function with rating_id = ${rating_id} not exists at rating_controller.js;')
                res.status(result.statusCode || 400).json(result) 
            }
        } catch(err) {
            console.error({err},  '----> err in deleteRate function at rating_controller.js ')
            res.status(err.statusCode || 500).json(err)            
        }
    }

    async connectRatingToFeedback(req, res) {
        try{    
            const {message_id} = req.body
            const rating_id  = req.params.ratingId
            console.log(message_id, "message_id", rating_id, "provider_id")
            const connected_rating = await ratingmodel.connectToFeedback(rating_id, message_id)
            if (connected_rating.rows[0]) {
                // const result = { success: "Rating successfully connected with feedback" }
                const result = {
                    "success": true,
                    "data": connected_rating.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)  
            }else {
                const result = new Api404Error( 'rating_id', i18n.__('validation.isExist', `rating_id = ${rating_id}`)) 
                console.log(result, ` -----> err in connectRatingToFeedback function  with rating_id = ${rating_id} not exists at rating_controller.js;`)
                res.status(result.statusCode || 400).json(result)
            }
        }catch(err) {
            console.error({err},  '---->err in connectRatingToFeedback function at rating_controller.js ')
            res.status(err.statusCode || 500).json(err)             
        }
    }
   
    
}

const rating_controller = new RatingController();
export { rating_controller }