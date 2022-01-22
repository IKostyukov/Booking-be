import { advantagemodel } from '../models/advantage_model.js';
import { validationResult } from 'express-validator';
import  i18n   from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from'../enums/http_status_codes_enums.js';



class AdvantageController {

    // ### Advantage

    validationSchema = {

        advantageId: {
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: advantageId => {
                    return advantageId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'advantageId')},       
                bail: true,             
            },
            custom: {
                options:  (advantageId, { req, location, path}) => {   
                            
                    return advantagemodel.isExist(advantageId).then( is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows advantage from validationSchema')
    
                        if ( is_exist.rows[0].exists !== true) {
                            console.log('Advantage with advantage_id = ${advantageId} is not in DB (from advantage_controller.js)')
                            return Promise.reject('404 ' + i18n.__('validation.isExist', `advantage_id = ${advantageId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }
                    }).catch(err => {
                        if (err.error) {
                            const server_error = {
                                "success": false,
                                "error": {
                                    "code" : err.error.code,
                                    "message" : err.error.message,
                                    },
                                "data": err.data,
                                }
                            console.log(server_error, " ------------------> Server Error in validationSchema at advantage_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };                      
                    })
                },
            },
        },

        advantage_name: {

            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'advantage_name')},
                bail: true,
            },
            custom: {                
                
                options:  (value, { req, location, path}) => {
                    console.log(value, req, "----> req.params.advantageId")
                    if (req.method !== 'GET' ) {     
                            
                        return advantagemodel.isUnique(value).then( is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows advantage from validationSchema')
        
                            if ( is_unique.rows[0].exists == true) {
                                console.log('Advantage with advantage_name = ${value} is not in DB (from advantage_controller.js)')
                                return Promise.reject(i18n.__('validation.isUnique', `advantage_name '${value}'`));
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code" : err.error.code,
                                        "message" : err.error.message,
                                        },
                                    "data": {
                                        "advantage_name" : err.data,
                                    }
                                    }
                                console.log(server_error, " ------------------> Server Error in validationSchema at advantage_conrtoller.js")
                                return Promise.reject(server_error)
                            }else {
                                const msg = err
                                return Promise.reject(msg)
                            };                        
                        })
                    }
                },
                bail: true,
            },    
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'advantage_name')},
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'advantage_name')},
                options: {min:2, max:100 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        icon: {
            optional: true,
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'advantage_name')},
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'advantage_name')},
                options: {min:2, max:15 },
                bail: true,
            },
            trim: true,
            escape: true,
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
                    console.log(not_found_error,  ` ----> not_found_error from the AdvantageController.checkResult`) 
                    res.status(not_found_error.error.code || 404).json(not_found_error)
                }else{
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)        
                    console.log(bad_request_error,  ` ----> bad_request_error from the AdvantageController.checkResult`) 
                    res.status(bad_request_error.error.code || 400).json(bad_request_error) 
                }              
            }else{
                const server_error = data
                console.log(server_error,  ` ----> server_error from the AdvantageController.checkResult`) 
                res.status(server_error.error.code || 500).json(server_error) 
            }
        }else{
            return next()
        }              
    }

    async createAdvantage(req, res) {
        try{    
            const {advantage_name, icon} = req.body
            const new_advantage = await advantagemodel.create(advantage_name, icon)
            console.log(new_advantage.rows)
            if (new_advantage.rows[0].id) {
                const result = { 
                    success: true,
                    data: " Advantage successfully created"
                }
                console.log(new_advantage.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error( 'advantage_name', 'Unhandled Error')
                console.log(result, ' ----> err from createAdvantage function at advantage_controller.js')
                res.status(result.error.code || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in createAdvantage function at advantage_controller.js ')
            res.status(err.error.code || 500).json(err)
        }
    }

    async updateAdvantage(req, res) {
        try{    
            const advantage_id = req.params.advantageId
            const {advantage_name, icon} = req.body
            const updated_advantage = await advantagemodel.update(advantage_id, advantage_name, icon)
            if (updated_advantage.rows[0] !== undefined) {
                const result = { 
                    success: true,
                    data: " Advantage successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(updated_advantage.rows, result )
            } else {
                const result = new Api404Error( 'advantage_id', i18n.__('validation.isExist', `advantage_id = ${advantage_id}`)) 
                console.log(result, ' ----> err from updateAdvantage function at advantage_controller.js')
                res.status(result.error.code || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in updateAdvantage function at advantage_controller.js ')
            res.status(err.error.code || 500).json(err) 
        }
    }

    async activateAdvantage(req, res) {
        try{    
            const advantage_id = req.params.advantageId
            const {is_active} = req.body
            const activated_advantage = await advantagemodel.activate(advantage_id, is_active)
            console.log(activated_advantage.rows, '----> activated_advantage OK')
            
            if(activated_advantage.rows[0].is_active == false){
                const result = { 
                    success: true,
                    data: " Advantage successfully deactivated"
                }
                console.log(activated_advantage.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            }else if(activated_advantage.rows[0].is_active == true) {
                const result = { 
                    success: true,
                    data: " Advantage successfully activated"
                }
                console.log(activated_advantage.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            }else{                
                const result = new Api404Error( 'advantage_id', i18n.__('validation.isExist', `advantage_id  ${advantage_id}`)) 
                console.log(result, ` ----> err in activateAdvantage function with advantage_id ${advantage_id} not exists at advantage_controller.js;`)
                res.status(result.error.code || 404).json(result)
            } 
        } catch(err) {
            console.error({err},  '-----> err in activateAdvantage function at advantage_controller.js ')           
            res.status(err.error.code || 500).json(err)    
        }
    }

    async deleteAdvantage(req, res) {
        try{    
            const advantage_id = req.params.advantageId
            const deleted_advantage = await advantagemodel.delete(advantage_id)
            if (deleted_advantage.rows.length !== 0) {
                const result = { 
                    success: true,
                    data: " Advantage successfully deleted"
                }
                console.log(deleted_advantage.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_advantage.rows.length == 0) {
                const result = new Api404Error( 'advantage_id', i18n.__('validation.isExist', `advantage_id = ${advantage_id}`)) 
                console.log(result, ' ----> err in deleteAdvantage function with advantage_id = ${advantage_id} not exists at advantage_controller.js;')
                res.status(result.error.code || 400).json(result) 
            }
        } catch(err) {
            console.error({err},  '----> err in deleteAdvantage function at advantage_controller.js ')
            res.status(err.error.code || 500).json(err)            
        }
    }

    async getOneAdvantage(req, res) {
        try{    
            const advantage_id = req.params.advantageId  
            const get_advantage = await advantagemodel.getOne(advantage_id)
            if (get_advantage.rows.length !== 0 ) {
                const result = {
                    "success": true,
                    "data": get_advantage.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)            
            } else {
                const result = new Api404Error( 'advantage_id', i18n.__('validation.isExist', `advantage_id = ${advantage_id}`)) 
                console.log(result, ` -----> err in getAdvantage function with advantage_id = ${advantage_id} not exists at advantage_controller.js;`)
                res.status(result.error.code || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '---->err in getAdvantage function at advantage_controller.js ')
            res.status(err.error.code || 500).json(err)            
        }
    }

    async getAllAdvantages(req, res) {
        try{    
            const { advantage_name } = req.body
            const get_advantages = await advantagemodel.getMany(advantage_name)
            if (get_activities.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_activities.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)  
            }else {
                const result = new Api404Error( 'advantage_name', i18n.__('validation.isExist', `advantage_name = ${advantage_name}`)) 
                console.log(result, ` -----> err in getAdvantages function  with advantage_name = ${advantage_name} not exists at advantage_controller.js;`)
                res.status(result.error.code || 400).json(result)
            }
        }catch(err) {
            console.error({err},  '---->err in getActivities function at advantage_controller.js ')
            res.status(err.error.code || 500).json(err)             
        }
    }
}

const advantage_controller = new AdvantageController();
export { advantage_controller }