import uid from 'uid2';
import { pool } from '../db.js';
import { user } from '../models/user_model.js';
import { favoriteequipment_model } from '../models/favoriteequipment_model.js';
import { check, body, param, oneOf, validationResult } from 'express-validator';


const db = pool


  //  UUID generaate

const createUuid = () => {
    let profile_id = uid(15)
    console.log(profile_id, "createUuid from user_controller.js")
    return profile_id
};


class UserController {

    validationBodyRules = {
        "forCreating" :  [
            body('activity_name', 'activity_name could not be empty').notEmpty(),
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
            body('active', 'active could not be empty').notEmpty(),
            body('active', 'active must be boolean').isBoolean(),
            ], 
        "forGettinOne" :  [
            param('activityId', 'activity_id must be integer').exists(),
            param('activityId', 'activity_id must be integer').isInt(),            
            ],
        "forGettingAll" :  [            
            body('activity_name', 'activity_name could not be empty').notEmpty(),
            body('activity_name', 'activity_name must be srting').isString(),  // цифры тоже в формате строки проиходят
            ],     
    }

    checkRules (req, res, next) {
        const validation_result = validationResult(req)
        const hasError = !validation_result.isEmpty();
        console.log(hasError, " ----> hasError", validation_result, "----> validation_result", ) 
        if (hasError) {
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "Invalid value(s)"
                    },
                "data": {
                    "active" : validation_result.errors[0].msg,
                }
            }
            console.log(result,  ` ----> in the ActivityController.validateActivity`)    
            res.status(400).json(result)    
        }else{
            return next()
        }         
    }

           

    async createUser(req, res) {
        const {email, phone, first_name, last_name, patronymic, dob, service, roles } = req.body
        const roles_id = Array.from(roles.split(','), Number)
        let profile_id;
        // if (service == 'local') {
            profile_id = createUuid()
        // } else  {
        //     // Добаваить Google profile_id
        //     // Добаваить Facebook profile_id
        // }
       
        const new_person = await user.create(email, phone, first_name, last_name, patronymic, dob ,profile_id, service,  roles_id)
        if (new_person.new_user.rows[0].id && new_person.new_role[0].rows[0].role_id) {
            const result = { success: "User successfully created" }
            res.json(result)
            console.log(new_person.new_user.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
        
        
    }

    async updateUser(req, res) {
        const updated_person = await user.update(req, res)
        if (updated_person.updated_user && updated_person.updated_roles) {
            const result = { success: "User successfully updated" }
            res.json(result)
            console.log(updated_person.updated_user.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateUser(req, res) {
        const activated_person = await user.activate(req, res)
        if (activated_person.rows[0].active == true) {
            const result = { success: "User successfully activated" }
            res.json(result)
            console.log(activated_person.rows[0], result)
        } else if (activated_person.rows[0].active == false) {
            const result = { success: "User successfully deactivated" }
            res.json(result)
            console.log(activated_person.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteUser(req, res) {
        const deleted_person = await user.delete(req, res)
        if (deleted_person.rows.length !== 0) {
            const success = { success: "User successfully deleted" }
            res.json(success)
            console.log( deleted_person.rows, "Successfully deleted!")
        } else if (deleted_person.rows.length == 0) {
            const success = { Error: "User not found" }
            res.json(success) 
        }else {
            const success = { Error: "Error" }
            res.json(success)
        }
    }

    async getUser(req, res) {
        const get_user = await user.getOneWithRoles(req, res)
        res.json(get_user)
        console.log(get_user)
    }

    async getUsers(req, res) {
            console.log(req.body)
        const get_users = await user.getMany(req, res)
        res.json(get_users)
    }

    async addFavoriteEquipment(req, res) {
        const equipmentprovider_id = req.params.equipmentproviderId
        const user_id = req.params.userId
        const new_favoriteequipment = await favoriteequipment_model.AddFavorite(equipmentprovider_id, user_id)
        if (new_favoriteequipment.rows[0].id) {
            const result = { success: true }
            res.json(result)
            console.log(new_favoriteequipment.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteFavoriteEquipment(req, res) {
        const equipmentprovider_id = req.params.equipmentproviderId
        const user_id = req.params.userId
        const deleted_favoriteequipment = await favoriteequipment_model.deleteFavorite(equipmentprovider_id, user_id)
        if (deleted_favoriteequipment.rows.length !== 0) {
            const result = { success: true }
            res.json(result)
            console.log( deleted_favoriteequipment.rows, "Successfully deleted!")
        } else if (deleted_favoriteequipment.rows.length == 0) {
            const result = { Error: "Favoriteequipment not found" }
            res.json(result) 
        }else {
            const result = { Error: "Error" }
            res.json(result)
        }
    }

    async getFavoriteEquipment(req, res) {
        const user_id = req.params.userId
        const list_favoriteequipment = await favoriteequipment_model.getFavorite(user_id)
        if (list_favoriteequipment.rows.length !== 0) {
            const result = list_favoriteequipment.rows
            res.json(result)
            console.log(list_favoriteequipment.rows)
        } else if (list_favoriteequipment.rows.length == 0) {
            const result = { Error: "Favoriteequipment not found" }
            res.json(result) 
        }else {
            const result = { Error: "Error" }
            res.json(result)
        }
    }
}

const user_controller = new UserController();
export { user_controller }