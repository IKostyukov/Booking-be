import { activity } from '../models/activity_model.js';
import { validationResult } from 'express-validator';
import  i18n   from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from'../enums/http_status_codes_enums.js';

// console.log( i18n, " ---> i18n in the activity_controller.js")

class ActivityController {

    //  ### Activity
    
    validationSchema = {

        activityId: {
            // The location of the field, can be one or more of body, cookies, headers, params or query.
            // If omitted, all request locations will be checked
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: activityId => {
                    return activityId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'activityId')},       
                bail: true,             
            },
            custom: {
                options:  (activityId, { req, location, path}) => {   
                            
                    return activity.isExist(activityId).then( is_exist => {
                        console.log(is_exist, '-------> is_exist activity from validationSchema')
    
                        if ( is_exist.rows[0].exists !== true) {
                            console.log('Activity with activity_id = ${activityId} is not in DB (from activity_controller.js)')
                            return Promise.reject('404 ' + i18n.__('validation.isExist', `activity_id = ${activityId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at activity_conrtoller.js")
                            return Promise.reject(server_error)
                        }else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        activity_name: {

            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'activity_name')},
                bail: true,
            },
            custom: {                
                
                options:  (value, { req, location, path}) => {
                    console.log(value, req, "----> req.params.activityId")
                    if (req.method !== 'GET' ) {     
                            
                        return activity.isUnique(value).then( is_unique => {
                            console.log(is_unique, '-------> is_unique activity from validationSchema')
        
                            if ( is_unique.rows[0].exists == true) {
                                console.log('Activity with activity_name = ${value} is not in DB (from activity_controller.js)')
                                return Promise.reject(i18n.__('validation.isUnique', `activity_name '${value}'`));
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
                                        "activity_name" : err.data,
                                    }
                                    }
                                console.log(server_error, " ------------------> Server Error in validationSchema at activity_conrtoller.js")
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
                errorMessage: () => { return i18n.__('validation.isString', 'activity_name')},
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'activity_name')},
                options: {min:2, max:100 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        active: {

            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'active')},
                bail: true,
            },                
            isBoolean: { 
                errorMessage: () => { return i18n.__('validation.isBoolean', 'active')},
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
                    console.log(not_found_error,  ` ----> not_found_error from the ActivityController.checkResult`) 
                    res.status(not_found_error.error.code || 404).json(not_found_error)
                }else{
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)        
                    console.log(bad_request_error,  ` ----> bad_request_error from the ActivityController.checkResult`) 
                    res.status(bad_request_error.error.code || 400).json(bad_request_error) 
                }              
            }else{
                const server_error = data
                console.log(server_error,  ` ----> server_error from the ActivityController.checkResult`) 
                res.status(server_error.error.code || 500).json(server_error) 
            }
        }else{
            return next()
        }              
    }

    async createActivity (req, res) { 
        const {activity_name} = req.body
        try{
            const new_activity = await activity.create(activity_name)               
            if (new_activity.rows[0].id ) {
                const result = { 
                    success: true,
                    data: " Activity successfully created"
                }
                console.log(new_activity.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error( 'activity_name', 'Unhandled Error')
                console.log(result, ' ----> err from createActivity function at activity_controller.js')
                res.status(result.error.code || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in createActivity function at activity_controller.js ')
            res.status(err.error.code || 500).json(err)
        }
    }

    async updateActivity (req, res) {
        const activity_id = req.params.activityId
        const {activity_name } = req.body
        try{    
            const updated_activity = await activity.update(activity_id, activity_name) 
            if (updated_activity.rows.length !==0) {
                const result = { 
                    success: true,
                    data: " Activity successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(updated_activity.rows, result )
            } else {
                const result = new Api404Error( 'activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`)) 
                console.log(result, ' ----> err from updateActivity function at activity_controller.js')
                res.status(result.error.code || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in updateActivity function at activity_controller.js ')
            res.status(err.error.code || 500).json(err) 
        }
    }

    async activateActivity (req, res) {
        try{
            const activity_id = req.params.activityId
            const {active} = req.body
            console.log(activity_id, typeof(activity_id))
            // console.log( "------> controller is working in the activateActivity")     
            const activated_activity = await activity.activate(activity_id, active)
            console.log(activated_activity, " ----> activated_activity in activateActivity" )
            if (activated_activity.rows.length == 0) {                
                const result = new Api404Error( 'activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`)) 
                console.log(result, ` ----> err in activateActivity function with activity_id = ${activity_id} not exists at activity_controller.js;`)
                res.status(result.error.code || 404).json(result) 
            }else if(activated_activity.rows[0].active == false){
                const result = { 
                    success: true,
                    data: " Activity successfully deactivated"
                }
                console.log(activated_activity.rows, result)
                res.status(httpStatusCodes.OK || 200).json(success)
            }else if(activated_activity.rows[0].active == true) {
                const result = { 
                    success: true,
                    data: " Activity successfully activated"
                }
                console.log(activated_activity.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            }
        } catch(err) {
            console.error({err},  '-----> err in activateActivity function at activity_controller.js ')           
            res.status(err.error.code || 500).json(err)    
        }
    }

    async deleteActivity (req, res) {
        try{
            const activity_id = req.params.activityId
            const deleted_activity = await activity.delete(activity_id)
            if (deleted_activity.rows.length !== 0) {
                const result = { 
                    success: true,
                    data: " Activity successfully deleted"
                }
                console.log(deleted_activity.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_activity.rows.length == 0) {
                const result = new Api404Error( 'activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`)) 
                console.log(result, ' ----> err in deleteActivity function with activity_id = ${activity_id} not exists at activity_controller.js;')
                res.status(result.error.code || 400).json(result) 
            }
        } catch(err) {
            console.error({err},  '----> err in deleteActivity function at activity_controller.js ')
            res.status(err.error.code || 500).json(err)            
        }       
    }

    async getActivity (req, res) {
        const activity_id = req.params.activityId 
        try{
            const get_activity = await activity.getOne(activity_id)
            if (get_activity.rows.length !== 0 ) {
                const result = {
                    "success": true,
                    "data": get_activity.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)            
            } else {
                const result = new Api404Error( 'activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`)) 
                console.log(result, ` -----> err in getActivity function with activity_id = ${activity_id} not exists at activity_controller.js;`)
                res.status(result.error.code || 400).json(result) 
            }
        }catch(err) {
            console.error({err},  '---->err in getActivity function at activity_controller.js ')
            res.status(err.error.code || 500).json(err)            
        }
    }

    async getActivities (req, res) {
        try{    
            const { activity_name } = req.body  
            const get_activities = await activity.getAll(activity_name)
            if (get_activities.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_activities.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)  
            }else {
                const result = new Api404Error( 'activity_name', i18n.__('validation.isExist', `activity_name = ${activity_name}`)) 
                console.log(result, ` -----> err in getActivity function  with activity_name = ${activity_name} not exists at activity_controller.js;`)
                res.status(result.error.code || 400).json(result)
            }
        }catch(err) {
            console.error({err},  '---->err in getActivities function at activity_controller.js ')
            res.status(err.error.code || 500).json(err)             
        }
    }

    // Поисковые запросы
    async getPopularActivities(req, res) {
        try{
            const popular_activities = await activity.getPopular()
            if (popular_activities.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": popular_activities.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)  
            }else {
                const result = new Api404Error( 'getPopularActivities', i18n.__('validation.isExist', 'getPopularActivities')) 
                console.log(result, ` -----> err in getPopularActivities function  at activity_controller.js;`)
                res.status(result.error.code || 400).json(result)
            }
        }catch(err) {
            console.error({err},  '----->err in getPopularActivities function at activity_controller.js ')
            res.status(err.error.code || 500).json(err)
        }
    }

    // Этот подход может пригодиться в валидации PROVIDER ( не удалять до завершения валидации providers)
//  validationRules & checkRules заменены выше на validationSchema & checkResult соответственно


    // validationRules = {
    //     "forCreating" :  [
    //         body('activity_name').isEmpty().withMessage(() => {
    //             return i18n.__('validation.notEmpty', 'activity_name')
    //             }),
    //         ],
    //     "forUpdating" :  [ 
    //         param('activityId').not().isUUID().withMessage(() => {          // not() убрать когда заменим id на uuid
    //                 return i18n.__('validation.isUUID', 'activityId')        // цифры в формате строки проиходят    
    //             }),                                                      //   .bail().isLength({min:10, max: 10}),     // и добавить isLength()   когда заменим id на uuid      
 
    //         body('activity_name').isEmpty().withMessage(() => {
    //                 return i18n.__('validation.notEmpty', 'activity_name')
    //             }).bail().isString().withMessage(() => {
    //                 return i18n.__('validation.isString', 'activity_name')
    //             }).bail().isLength({min:2, max:100 }).withMessage(() => {
    //                 return i18n.__('validation.isLength', 'activity_name')
    //             }),         
    //         ],
    //     "forActivation" : [
    //         param('activityId').not().isUUID().withMessage(() => {              // not() убрать когда заменим id на uuid
    //                 return i18n.__('validation.isUUID', 'activityId')           // цифры в формате строки проиходят                                                                   
    //             }),                                                             //   .bail().isLength({min:10, max: 10}),     // и добавить isLength()   когда заменим id на uuid      
        
    //         body('active').notEmpty().withMessage(() => {
    //                 return i18n.__('validation.isEmpty', 'active')
    //             }).bail().isBoolean().withMessage(() => {
    //                 return i18n.__('validation.isBoolean', 'active')
    //             }),     
    //         ],  
    //     "forDelete" : [
    //         param('activityId').not().isUUID().withMessage(() => {              // not() убрать когда заменим id на uuid
    //                 return i18n.__('validation.isUUID', 'activityId')           // цифры в формате строки проиходят    
    //             }),                                                              //   .bail().isLength({min:10, max: 10}),     // и добавить isLength()   когда заменим id на uuid                                                                  
    //         ], 
    //     "forGettingOne" :  [
    //         param('activityId').not().isUUID().withMessage(() => {              // not() убрать когда заменим id на uuid
    //                 return i18n.__('validation.isUUID', 'activityId')           // цифры в формате строки проиходят    
    //             }),                                                              //   .bail().isLength({min:10, max: 10}),     // и добавить isLength()   когда заменим id на uuid      
    //         ],
    //     "forGettingAll" :  [            
    //         body('activity_name').notEmpty().withMessage(() => {
    //             return i18n.__('validation.isEmpty', 'activity_name')
    //         }).bail().isString().withMessage(() => {
    //             return i18n.__('validation.isString', 'activity_name')
    //         }).bail().isLength({min:2, max:5 }).withMessage(() => {
    //             return i18n.__('validation.isLength', 'activity_name')
    //         }),  
    //     ],     
    // }
    
    

    // async checkRules(req, res, next) {
    //     // console.log(i18n.getLocale(),'------> locale')
    //     const validation_result = validationResult(req)
    //     const hasError = !validation_result.isEmpty();
    //     console.log(hasError, " ----> hasError", validation_result, " ----> validation_result", ) 
    //     if (hasError) {
    //         const param = validation_result.errors[0].param
    //         const data = validation_result.errors[0].msg
    //         // console.log(validation_result.errors, '-----> validation_result.errors')
    //         const result = {
    //             "success": false,
    //             "error": {
    //                 "code" : 400,
    //                 "message" : "Invalid value(s)"
    //                 },
    //             "data": {
    //                [param] :  data,
    //             }
    //         }
    //         console.log(result,  ` ----> in the ActivityController.checkRules`) 
    //         res.status(400).json(result) 
    //     }else{
    //         try{
    //             const activity_id = req.params.activityId
    //             console.log(activity_id, typeof(activity_id), '-------> req.params.activityId')
        
    //             const is_exist = await activity.isExist(activity_id)
    //             if (is_exist ) {
    //                 return next()
    //             }else{
    //                 const result = {
    //                     "success": false,
    //                     "error": {
    //                         "code" : 404,
    //                         "message" : "Not Found"
    //                     },
    //                     "data": {
    //                         "activity_id" : `Activity with activity_id=${activity_id}  not exists`,
    //                     }
    //                 }
    //                 console.log(result, " -----> from ActivityController.deleteActivity.getOne")
    //                 res.status(404).json(result) 
    //             } 
    //         }catch(err) {
    //             res.status(500).json(err) 
    //         }
    //     }         
    // }

}

const activity_controller = new ActivityController();
export { activity_controller }



