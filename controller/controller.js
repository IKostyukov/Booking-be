import { pool } from '../db.js';
import { activities } from '../models/activities.js';
import { users } from '../models/users.js';
import { facilities } from  '../models/facilities.js';
import { equipments } from '../models/equipments.js';

const db = pool


class Controller {

    async createUser(req, res) {
        const new_person = await users.create(req, res)
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
        const updated_person = await users.update(req, res)
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
        const activated_person = await users.activate(req, res)
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
        const deleted_person = await users.delete(req, res)
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
        const get_user = await users.getOne(req, res)
        res.json(get_user)
        console.log(get_user)
    }

    async getUsers(req, res) {
            console.log(req.body)
        const get_users = await users.getMany(req, res)
        res.json(get_users)
    }

    async createActivity (req, res) {
        const new_activity = await activities.create(req, res)               
        if (new_activity.rows[0].id ) {
            const result = { success: "Activity successfully created" }
            res.json(result)
            console.log(new_activity.rows[0], result)
            // res.json( new_person.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateActivtiy (req, res) {
        const updated_activity = await activities.update(req, res) 
        if (updated_activity) {
            const result = { success: "Activity successfully updated" }
            res.json(result)
            console.log(updated_activity.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateActivtiy (req, res) {
        const activated_activity = await activities.activate(req, res)
        if (activated_activity.rows[0].active == true) {
            const result = { success: "Activity successfully activated" }
            res.json(result)
            console.log(activated_activity.rows[0], result)
        } else if (activated_activity.rows[0].active == false) {
            const result = { success: "Activity successfully deactivated" }
            res.json(result)
            console.log(activated_activity.rows[0], result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }

    async deleteActivity (req, res) {
        const deleted_activity = await activities.delete(req, res)
        if (deleted_activity.rows.length !== 0) {
            const result = { success: "Activity successfully deleted" }
            res.json(result)
            console.log( deleted_activity.rows, result)
        } else if (deleted_activity.rows.length == 0) {
            const result = { Error: "Activity not found" }
            res.json(result) 
        }else {
            const result = { Error: "Error" }
            res.json(result)
        }
    }

    async getActivity (req, res) {
        const get_activity = await activities.getOneActivity(req, res)
        if (get_activity.rows.length == 0) {
            const result = { Error: "Activity not found" }
            res.json(result) 
        }else {
            res.json(get_activity.rows[0])
            console.log(get_activity.rows)
        }
    }

    async getActivities (req, res) {        
        const get_activities = await activities.getAllActivities(req, res)
        if (get_activities.rows.length == 0) {
            const err = { Error: "Activiiea not found" }
            res.json(err) 
        }else {
            res.json(get_activities.rows)
            console.log(get_activities.rows)
        }
    }

    // Поисковые запросы

    async getBestFacilities(req, res) {
        const best_facilities = await facilities.getBest(req, res)
        res.json((best_facilities).rows)
    }


    async getPopularActivities(req, res) {
        const popular_activities = await activities.getPopular(req, res)
        console.log((popular_activities).rows)
        res.json((popular_activities).rows)
    }

    async getSearchEquipment(req, res) {
        const get_equipments = await equipments.getSearch(req, res)
        res.json(get_equipments.rows)
    }

    async doPost(req, res) {
        const { name, surname } = req.body
        console.log(name, surname)
        res.json('ok')
    }

}

const controller = new Controller();
export { controller }



