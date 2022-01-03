import { pool } from '../db.js';
import { activity } from '../models/activity_model.js';
import { check, body, param, oneOf, validationResult } from 'express-validator';

// import { I18n }  from 'i18n';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

import { validationAlert } from '../Alerts/validation_alerts.js';
import  { i18n } from '../server.js';
const db = pool
// var i18n =  new I18n({
//     locales: ['en', 'ru', 'uk'],
//     // directory: path.join(__dirname, 'locales'),
//     directory: '/home/user/MyWorks/Wave/locales',
//     objectNotation: true
//     });
// i18n.init
const test = (req, res) => {
        res.send(res.__("Hello.World"));
    }


class ActivityController {

    //  ### Activity

    validationBodyRules = {
        "forCreating" :  [
            // body('activity_name', __('validation.notEmpty', 'activity_name')).notEmpty(),
            body('activity_name', 'activity_name must be srting').isString(),  // цифры тоже в формате строки проиходят
                    ],
        "forUpdating" :  [
            param('activityId', 'activity_id must be integer').exists(),
            param('activityId', 'activity_id must be integer').isInt(),
            body('activity_name', 'activity_name could not be empty').notEmpty(),
            body('activity_name', 'activity_name must be srting').isString(),  // цифры тоже в формате строки проиходят
            ],
        "forActivation" : [
            param('activityId', 'activity_id must be integer').exists(),
            param('activityId', 'activity_id must be integer').isInt(),
            // body('active', validationAlert.notEmpty('active')).notEmpty(),
            body('active', 'could not be empty').notEmpty(),
            body('active', 'must be Boolean').isBoolean(),
            ], 
        "forGettingOne" :  [
            param('activityId', 'activity_id must be integer').exists(),
            param('activityId', 'activity_id must be integer').isInt(),            
            ],
        "forGettingAll" :  [            
            body('activity_name', 'activity_name could not be empty').notEmpty(),
            body('activity_name', 'activity_name must be srting').isString(),  // цифры тоже в формате строки проиходят
            ],     
    }

    checkRules(req, res, next) {
        const validation_result = validationResult(req)
        const hasError = !validation_result.isEmpty();
        console.log(hasError, " ----> hasError", validation_result, "----> validation_result", ) 
        if (hasError) {
            const param = validation_result.errors[0].param
            const data = res.__(validation_result.errors[0].msg)
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "Invalid value(s)"
                    },
                "data": {
                   [param] : param + data,
                }
            }
            console.log(result,  ` ----> in the ActivityController.validateActivity`)   
            
            console.log(i18n.__("Hello.World"))

            // test(req, res) 
            res.status(400).json(result)    
            // res.__('Hello')
        }else{
            return next()
        }         
    }

    async createActivity (req, res) {
        const {activity_name} = req.body
        const new_activity = await activity.create(activity_name)               
        if (new_activity.rows[0].id ) {
            const result = { success: true }
            res.json(result)
            console.log(new_activity.rows[0], " Activity successfully created")
            // res.json( new_person.rows[0].id)
        } else {
            const result = {}
            console.log(result)
            res.json(result)
        }
    }

    async updateActivity (req, res) {
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
    }

    async activateActivity (req, res) {
        const activity_id = req.params.activityId
        const {active} = req.body
        console.log(activity_id, typeof(activity_id))
        console.log( "------> controller is working in the activateActivity")      

        const activated_activity = await activity.activate(activity_id, active)
        if (activated_activity.rows[0].active == true) {
            const result = { success: true}
            console.log(activated_activity.rows[0], "Activity successfully activated" )
            res.json(result)
        } else if (activated_activity.rows[0].active == false) {
            const result = { success: true }
            res.json(result)
            console.log(activated_activity.rows[0], "Activity successfully deactivated")
        } else {
            const result = {}
            console.log(result)
            res.json(result)
        }
    }

    async deleteActivity (req, res) {
        const activity_id = req.params.activityId
        const get_activity = await activity.getOne(activity_id)
        if (get_activity.rows.length !== 0 ) {
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
                console.log(result)
                res.json(result)
            }
        }else{  // дублирует тоже что и предыдущий (else if)
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
            console.log(result, " -----> from ActivityController.deleteActivity.getOne")
            res.status(404).json(result) 
        }
    }

    async getActivity (req, res) {
        const activity_id = req.params.activityId 
        const get_activity = await activity.getOne(activity_id)
        if (get_activity.rows.length !== 0 ) {
            const result = {
                "success": true,
                "data": get_activity.rows[0]
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
            console.log(result, ` -----> activity with activity_id = ${activity_id} not exists; from ActivityController.getActivity`)
            res.status(404).json(result) 
        }
    }

    async getActivities (req, res) {    
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
    }

    // Поисковые запросы
    async getPopularActivities(req, res) {
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
    }
}

const activity_controller = new ActivityController();
export { activity_controller }



