import { pool } from '../db.js';
import { activity } from '../models/activity_model.js';

const db = pool


class ActivityController {


    // Activity #####

    async createActivity (req, res) {
        const new_activity = await activity.create(req, res)               
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

    async updateActivity (req, res) {
        const updated_activity = await activity.update(req, res) 
        if (updated_activity) {
            const result = { success: "Activity successfully updated" }
            res.json(result)
            console.log(updated_activity.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateActivity (req, res) {
        const activated_activity = await activity.activate(req, res)
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
        const deleted_activity = await activity.delete(req, res)
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
        const get_activity = await activity.getOne(req, res)
        if (get_activity.rows.length == 0) {
            const result = { Error: "Activity not found" }
            res.json(result) 
        }else {
            res.json(get_activity.rows[0])
            console.log(get_activity.rows)
        }
    }

    async getActivities (req, res) {        
        const get_activities = await activity.getAll(req, res)
        if (get_activities.rows.length == 0) {
            const err = { Error: "Activiiea not found" }
            res.json(err) 
        }else {
            res.json(get_activities.rows)
            console.log(get_activities.rows)
        }
    }

    // Поисковые запросы
    async getPopularActivities(req, res) {
        const popular_activities = await activity.getPopular()
        console.log((popular_activities).rows)
        res.json((popular_activities).rows)
    }

}

const activity_controller = new ActivityController();
export { activity_controller }



