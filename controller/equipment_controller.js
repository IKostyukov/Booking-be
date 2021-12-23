import { pool } from '../db.js';
import { equipmentmodel } from '../models/equipment_model.js';


const db = pool

class EquipmentController {

    async createEquipment (req, res) {
        const {equipment_name, activity_id,  capacity} = req.body
        const new_equipment = await equipmentmodel.create(equipment_name, activity_id,  capacity)               
        if (new_equipment.rows[0].id ) {
            const result = { success: "Equipment successfully created" }
            res.json(result)
            console.log(new_equipment.rows[0], result)
            // res.json( new_person.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateEquipment (req, res) {
        const equipment_id = req.params.equipmentId
        const {equipment_name, capacity  } = req.body
        console.log(equipment_name, equipment_id, capacity)
        const updated_equipment = await equipmentmodel.update(equipment_name, equipment_id, capacity) 
        if (updated_equipment.rows[0]) {
            const result = { success: "Equipment successfully updated" }
            res.json(result)
            console.log(updated_equipment, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateEquipment (req, res) {
        const {active} = req.body
        const equipment_id = req.params.equipmentId
        const activated_equipment = await equipmentmodel.activate(equipment_id, active)
        console.log(activated_equipment)
        if (activated_equipment.rowCount == 0) {
            const result = { Error: 404 }
            res.json(result)
        } else if (activated_equipment.rows[0].active == true) {
            const result = { success: "Equipment successfully activated" }
            res.json(result)
            console.log(activated_equipment.rows[0], result)
        } else if (activated_equipment.rows[0].active == false) {
            const result = { success: "Equipment successfully deactivated" }
            res.json(result)
            console.log(activated_equipment.rows[0], result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }

    async deleteEquipment (req, res) {
        const equipment_id = req.params.equipmentId 
        const deleted_equipment = await equipmentmodel.delete(equipment_id)
        if (deleted_equipment.rows.length !== 0) {
            const result = { success: "Equipment successfully deleted" }
            res.json(result)
            console.log( deleted_equipment.rows, result)
        } else if (deleted_equipment.rows.length == 0) {
            const result = { Error: "Equipment not found" }
            res.json(result) 
        }else {
            const result = { Error: "Error" }
            res.json(result)
        }
    }

    async getEquipment (req, res) {
        const equipment_id = req.params.equipmentId 
        const get_activity = await equipmentmodel.getOne(equipment_id)
        if (get_activity.rows.length == 0) {
            const result = { Error: "Equipment not found" }
            res.json(result) 
        }else {
            res.json(get_activity.rows[0])
            console.log(get_activity.rows)
        }
    }

    async getEquipments (req, res) {
        const { equipment_name } = req.body         
        const get_equipments = await equipmentmodel.getAll(equipment_name)
        if (get_equipments.rows.length == 0) {
            const err = { Error: "Equipments not found" }
            res.json(err) 
        }else {
            res.json(get_equipments.rows)
            console.log(get_equipments.rows)
        }
    }

    async getSearchEquipment(req, res) {
        const get_equipments = await equipmentmodel.getSearch(req, res)
        res.json(get_equipments.rows)
    }


}

const equipment_controller = new EquipmentController();
export {equipment_controller} 