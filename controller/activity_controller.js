import { pool } from '../db.js';
import { activity } from '../models/activity_model.js';
import { body, param,  validationResult } from 'express-validator';
import { checkSchema } from 'express-validator';
import  i18n   from 'i18n';


const db = pool



// console.log( i18n, " ---> i18n in the activity_controller.js")

class ActivityController {

    //  ### Activity
    
    registrationSchema = {

        activityId: {
            // The location of the field, can be one or more of body, cookies, headers, params or query.
            // If omitted, all request locations will be checked
            in: ['params'],
            isInt: {
                if: activityId => {
                    return activityId !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isInt', 'activityId')},       
                bail: true,
            },
            custom: {
                options:  (activityId, { req, location, path }) => {           
                
                    try{ return  activity.isExist(activityId).then(is_exist => {
                            console.log(is_exist, '-------> is_exist from registrationSchema')
                            if (is_exist.rows[0].exists !== true) {
                                console.log('Activity with activity_id = ${activityId} is not in DB (from activity_controller.js)')
                                return Promise.reject(i18n.__('validation.notFound', `activity_id = ${activityId}`));
                            }
                        });
                    }catch(err){
                        console.log(err, " ---------------------------> never works")
                    }
                },
            },
        },

        activity_name: {

            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.notEmpty', 'activity_name')},
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
            custom: {                
                options:  (value, { req, location, path }) => { 
                    console.log(req.params, "----> req.params.activityId")
                    if (req.params.activityId == undefined) {                       
                    
                        try{ return  activity.isUnique(value).then(is_unique => {
                                // console.log(is_unique, '-------> is_unique from registrationSchema')
                                if (is_unique.rows[0].exists == true) {
                                        console.log('Activity with activity_name = ${value} is alredy exist in DB (from activity_controller.js)')
                                        return Promise.reject(i18n.__('validation.isUnique', `${value}`));
                                }
                            });
                        }catch(err){
                            console.log(err, " ---------------------------> never works")
                        }
                    }else{
                        return value
                    }
                },
                bail: true,
            },    
        },

        active: {

            notEmpty: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.notEmpty', 'active')},
                bail: true,
            },                
            isBoolean: { 
                errorMessage: () => { return i18n.__('validation.isBoolean', 'active')},
                bail: true,
            },
        },
      }

    async checkResult(req, res, next)  {
        console.log(" ----> checkResult" ) 

        // console.log(i18n.getLocale(),'------> locale')
        const validation_result = validationResult(req)
        const hasError = !validation_result.isEmpty();
        console.log(hasError, " ----> hasError", validation_result, " ----> validation_result", ) 
        if (hasError) {
            const param = validation_result.errors[0].param
            const data = validation_result.errors[0].msg
            // console.log(validation_result.errors, '-----> validation_result.errors')
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "Invalid value(s)"
                    },
                "data": {
                    [param] :  data,
                }
            }
            console.log(result,  ` ----> from the ActivityController.checkResult`) 
            res.status(400).json(result) 
        }else{
            return next()
        }              
    }

   

    async createActivity (req, res) { // нужна проверка нет ли активности с таким именем
        try{
            const {activity_name} = req.body
            const new_activity = await activity.create(activity_name)               
            if (new_activity.rows[0].id ) {
                const result = { success: true }
                res.json(result)
                console.log(new_activity.rows[0], " Activity successfully created")
                // res.json( new_person.rows[0].id)
            } else {
                const result = {}   //?????
                console.log(result)
                res.json(result)
            }
        }catch(err) {
            res.status(500).json(err) 
        }
    }

    async updateActivity (req, res) {
        try{            
            const activity_id = req.params.activityId
            const {activity_name } = req.body
            const updated_activity = await activity.update(activity_id, activity_name) 
            if (updated_activity) {
                const result = { success: true}
                res.json(result)
                console.log(updated_activity.rows, "Activity successfully updated" )
            } else {
                const result = {}
                console.log(result)
                res.json(result)
            }
        }catch(err) {
            res.status(500).json(err) 
        }
    }

    async activateActivity (req, res) {
        try{
            const activity_id = req.params.activityId
            const {active} = req.body
            console.log(activity_id, typeof(activity_id))
            // console.log( "------> controller is working in the activateActivity")      

            const activated_activity = await activity.activate(activity_id, active)
            // console.log(activated_activity, " ----> activated_activity in activateActivity" )


            if (activated_activity.rows[0].active == true) {
                const result = { success: true}
                console.log(activated_activity.rows[0], "Activity successfully activated" )
                res.json(result)
            } else {
                const result = { success: true }
                res.json(result)
                console.log(activated_activity.rows[0], "Activity successfully deactivated")
            }
        } catch(err) {
            if ( Object.keys(err).length == 0) {
                const result = {
                    "success": false,
                    "error": {
                        "code" : 400,
                        "message" : "Invalid value(s)"
                        },
                    "data": {
                        "activity_id" :  "Activity not found", // если зарос с БД с несушествующим id, то activated_activity.rows == 0
                    }
                }
                console.log(result, ' ----> from activateActivity function in activity_controller.js')
                res.status(400).json(result) 
            }else{
            res.status(500).json(err)
            } 
        }
    }

    async deleteActivity (req, res) {
        try{
            const activity_id = req.params.activityId
            const deleted_activity = await activity.delete(activity_id)
            if (deleted_activity.rows.length !== 0) {
                const result = { success: true }
                res.json(result)
                console.log( deleted_activity.rows, "Activity successfully deleted")
            } else if (deleted_activity.rows.length == 0) {
                const result = {
                    "success": false,
                    "error": {
                        "code" : 404,
                        "message" : "Not Found"
                    },
                    "data": {
                        "activity_id" : `Activity with activity_id=${activity_id} not exist`,
                    }
                }
                console.log(result, " -----> from ActivityController.deleteActivity")
                res.status(404).json(result) 
            } else {
                const result = {}
                console.log(result)  //????
                res.json(result)
            }
        } catch(err) {
            res.status(500).json(err) 
        }
       
    }

    async getActivity (req, res) {
        try{
            const activity_id = req.params.activityId 
            const get_activity = await activity.getOne(activity_id)
            if (get_activity.rows.length !== 0 ) {
                const result = {
                    "success": true,
                    "data": get_activity.rows[0]
                }
                console.log(result)
                res.json(result)            
            } else {
                const result = {
                    "success": false,
                    "error": {
                        "code" : 404,
                        "message" : "Not Found"
                    }
                }
                console.log(result, ` -----> activity with activity_id = ${activity_id} not exists; from ActivityController.getActivity`)
                res.status(404).json(result) 
            }
        }catch(err) {
            res.status(500).json(err) 
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
                res.json(result)  
            }else {
                const result = {
                    "success": false,
                    "error": {
                        "code" : 404,
                        "message" : "Not Found"
                    }
                }
                console.log(result, ` -----> activity with activity_name = ${activity_name} not exists; from ActivityController.getActivities`)
                res.status(404).json(result) 
            }
        }catch(err) {
            res.status(500).json(err) 
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
                res.json(result)  
            }else {
                const result = {
                    "success": false,
                    "error": {
                        "code" : 404,
                        "message" : "Not Found"
                    }
                }
                console.log(result, ` -----> activity with activity_name = ${activity_name} not exists; from ActivityController.getActivities`)
                res.status(404).json(result) 
            }
        }catch(err) {
            res.status(500).json(err) 
        }
    }

          //  validationRules  &  checkRules заменены на  registrationSchema & checkResult соответственно

     // validationRules = {
    //     "forCreating" :  [
    //         body('activity_name').notEmpty().withMessage(() => {
    //             return i18n.__('validation.notEmpty', 'activity_name')
    //             }),
    //         ],
    //     "forUpdating" :  [ 
    //         param('activityId').not().isUUID().withMessage(() => {          // not() убрать когда заменим id на uuid
    //                 return i18n.__('validation.isUUID', 'activityId')        // цифры в формате строки проиходят    
    //             }),                                                      //   .bail().isLength({min:10, max: 10}),     // и добавить isLength()   когда заменим id на uuid      
 
    //         body('activity_name').notEmpty().withMessage(() => {
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
    //                 return i18n.__('validation.notEmpty', 'active')
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
    //             return i18n.__('validation.notEmpty', 'activity_name')
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



