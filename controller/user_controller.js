import { pool } from '../db.js';
import { user } from '../models/user_model.js';
import { favoriteequipment_model } from '../models/favoriteequipment_model.js';


const db = pool


class UserController {

    async createUser(req, res) {
        const new_person = await user.create(req, res)
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