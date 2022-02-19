import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class EquipmentProviderModel {

    // ####  Инвентарь от объект отдыха  (equipmentsproviders) ###

    async create (provider_id, equipment_id, quantity, availabilitydate, cancellationdate) {
        try {
            // console.log(provider_id, equipment_id, '------------> in createNewEquipmentProvider function  at equipmentprovider_model.js') 
            const new_equipmentprovider = await db.query(`INSERT INTO equipmentsproviders(
                provider_id, equipment_id, quantity, availabilitydate, cancellationdate,  ctime)
                VALUES ($1, $2, $3, $4, $5, NOW())
                RETURNING *;`, [provider_id, equipment_id, quantity, availabilitydate, cancellationdate])

            // console.log(new_equipmentprovider.rows, `-----> new_equipmentprovider.rows in createNewEquipmentProvider function  at equipmentprovider_model.js`)
            return new_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in create function with provider_id = ${provider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create equipmentprovider', `${err.message}`)
        }
    }

    async update(equipmentprovider_id, provider_id, equipment_id, quantity, availabilitydate, cancellationdate) {
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


    async activate(equipmentprovider_id, active) {
        try {
            const activated_equipmentprovider = await db.query(`UPDATE equipmentsproviders
        SET active = $2 WHERE id = $1 RETURNING *;`,
                [equipmentprovider_id, active])
            return activated_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in activate function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async delete(equipmentprovider_id) {
        try {
            const deleted_equipmentprovider = await db.query(`DELETE FROM equipmentsproviders
            WHERE id = $1 RETURNING *;`, [equipmentprovider_id])
            return deleted_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in delete function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async findOne(equipmentprovider_id) {
        try {
            const one_equipmentprovider = await db.query(`SELECT id as equipmentprovider_id, active, provider_id, equipment_id, quantity,  availabilitydate, cancellationdate
            FROM equipmentsproviders
            WHERE id = ${equipmentprovider_id};`)
            return one_equipmentprovider
        } catch (err) {
            console.log(err, `-----> err in findOne function with equipmentprovider_id = ${equipmentprovider_id}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipmentprovider_id', `${err.message}`)
        }
    }

    async findAll({ state, sortBy, limit, offset, s}) {
        try {
            let sort_by_field = 'id'
            let sort_by_direction = 'ASC'
            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let sql_query = `SELECT id as equipmentprovider_id, active, provider_id, equipment_id, quantity,  availabilitydate, cancellationdate
            FROM equipmentsproviders `
            const where = `WHERE `
            let condition = ''
            const state_condition = `active = 'true' `
            let search_condition = `provider_id = ${s}`;

            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(id) AS count FROM equipmentsproviders '
            const and = 'AND '
            const end = '; '

            if (state) {
                condition += state_condition + and + search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else {
                condition += search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            }

            console.log(sql_query, `-----> sql_query  in findAll function  at equipmentprovider_model.js`)
            const all_promotions = await db.query(sql_query)
            return all_promotions
        } catch (err) {
            console.log(err, `-----> err in update getAllEquipmentOfProvider with provider_id = ${s}  at equipmentprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('find all equipment of rovider', `${err.message}`)
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


