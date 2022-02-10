import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class EquipmentProviderModel {

    // ####  Инвентарь от объект отдыха  (equipmentsproviders) ###

    async createNewEquipmentProvider(provider_id, equipment_id, quantity, availabilitydate, cancellationdate) {
        try {
            // console.log(provider_id, equipment_id, '------------> in createNewEquipmentProvider function  at equipmentprovider_model.js') 
            const new_equipmentprovider = await db.query(`INSERT INTO equipmentsproviders(
                provider_id, equipment_id, quantity, availabilitydate, cancellationdate,  ctime)
                VALUES ($1, $2, $3, $4, $5, NOW())
                RETURNING *;`, [provider_id, equipment_id, quantity, availabilitydate, cancellationdate])

            // console.log(new_equipmentprovider.rows, `-----> new_equipmentprovider.rows in createNewEquipmentProvider function  at equipmentprovider_model.js`)
            return new_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in createNewEquipmentProvider function with provider_id = ${provider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create equipmentprovider', `${err.message}`)
        }
    }

    async updateOneEquipmentProvider(equipmentprovider_id, provider_id, equipment_id, quantity, availabilitydate, cancellationdate) {
        try {
            console.log(provider_id, equipment_id)
            const updated_equipmentprovider = await db.query(`UPDATE equipmentsproviders
                SET  provider_id = $1, equipment_id=$2, quantity=$3, availabilitydate=$4, cancellationdate=$5
                WHERE id = $6
                RETURNING *;`, [provider_id, equipment_id, quantity, availabilitydate, cancellationdate, equipmentprovider_id])
            // console.log(updated_equipmentprovider.rows)
            return updated_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in update function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }


    async activateOneEquipmentProvider(equipmentprovider_id, active) {
        try {
            const activated_equipmentprovider = await db.query(`UPDATE equipmentsproviders
        SET active = $2 WHERE id = $1 RETURNING *;`,
                [equipmentprovider_id, active])
            return activated_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in activateOneEquipmentProvider function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async deleteOneEquipmentProvider(equipmentprovider_id) {
        try {
            const deleted_equipmentprovider = await db.query(`DELETE FROM equipmentsproviders
            WHERE id = $1 RETURNING *;`, [equipmentprovider_id])
            return deleted_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in deleteOneEquipmentProvider function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async getOneEquipmentOfProvider(equipmentprovider_id) {
        try {
            const one_equipmentprovider = await db.query(`SELECT id as equipmentprovider_id, active, provider_id, equipment_id, quantity,  availabilitydate, cancellationdate
            FROM equipmentsproviders
            WHERE id = ${equipmentprovider_id};`)
            return one_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in getOneEquipmentOfProvider function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async getAllEquipmentOfProvider(provider_id) {
        try {
            const all_equipmentprovider = await db.query(`SELECT id as equipmentprovider_id, active, provider_id, equipment_id, quantity,  availabilitydate, cancellationdate
            FROM equipmentsproviders
            WHERE provider_id = ${provider_id};`)
            return all_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in update getAllEquipmentOfProvider with provider_id = ${provider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('getAllEquipmentOfProvider', `${err.message}`)
        }
    }

    async isExist(equipmentprovider_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipmentsproviders WHERE id = ${equipmentprovider_id}) AS "exists";`
        try {
            const is_exist = await db.query(sql_query)
            // console.log(is_exist.rows)
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with equipmentprovider_id = ${equipmentprovider_id}  at  equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async isUniqueCombination(provider_id, equipment_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipmentsproviders WHERE provider_id = ${provider_id} AND equipment_id = '${equipment_id}') AS "exists";`
        try {
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isExist function with equipment_name = ${equipment_name}  in equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_name', `${err.message}`)
        }
    }
}

const equipmentprovidermodel = new EquipmentProviderModel();
export { equipmentprovidermodel };


