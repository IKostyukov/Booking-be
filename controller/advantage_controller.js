import { pool } from '../db.js';
import { advantagemodel } from '../models/advantage_model.js';

const db = pool


class AdvantageController {

    async createAdvantage(req, res) {
        const {advantage_name, icon} = req.body
        const new_advantage = await advantagemodel.create(advantage_name, icon)
        console.log(new_advantage.rows)
        if (new_advantage.rows[0].id) {
            const result = { success: "Advantage successfully created" }
            res.json(result)            
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateAdvantage(req, res) {
        const advantage_id = req.params.id
        const {advantage_name, icon} = req.body
        const updated_advantage = await advantagemodel.update(advantage_id, advantage_name, icon)
        console.log(updated_advantage.rows)
        if (updated_advantage.rows[0] !== undefined) {
            const result = { success: "Advantage successfully updated" }
            res.json(result)            
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateAdvantage(req, res) {
        const advantage_id = req.params.id
        const {active} = req.body
        const activated_advantage = await advantagemodel.activate(advantage_id, active)
        console.log(activated_advantage.rows[0])
        if (activated_advantage.rows[0].is_active == true) {
            const result = { success: "Advantage successfully activated" }
            res.json(result)
            console.log(activated_advantage.rows[0], result)
        } else if (activated_advantage.rows[0].is_active == false) {
            const result = { success: "Advantage successfully deactivated" }
            res.json(result)
            console.log(activated_advantage.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteAdvantage(req, res) {
        const advantage_id = req.params.id
        const deleted_advantage = await advantagemodel.delete(advantage_id)
        if (deleted_advantage.rows.length !== 0) {
            const success = { success: "Advantage successfully deleted" }
            res.json(success)
            console.log( deleted_advantage.rows, "Successfully deleted!")
        } else if (deleted_advantage.rows.length == 0) {
            const success = { Error: "Advantage not found" }
            res.json(success) 
        }else {
            const success = { Error: "Error" }
            res.json(success)
        }
    }

    async getAdvantage(req, res) {
        const advantage_id = req.params.id  
        const get_advantage = await advantagemodel.getOne(advantage_id)
        res.json(get_advantage.rows[0])
        console.log(get_advantage.rows)
    }

    async getAdvantages(req, res) {
        const { advantage_name } = req.body
        const get_advantages = await advantagemodel.getMany(advantage_name)
        res.json(get_advantages.rows)
        console.log(get_advantages.rows)
    }
}

const advantage_controller = new AdvantageController();
export { advantage_controller }