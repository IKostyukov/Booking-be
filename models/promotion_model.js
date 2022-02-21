import { pool } from "../db.js";
import Api500Error from '../errors/api500_error.js';

const db = pool

class PromotionModel {

    // ### Экстрадаты ###

    async isExist(promotion_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM promotions_equipment WHERE id = ${promotion_id}) AS "exists";`
            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, `----> is_exist. rows in isExist function with promotion_id = ${promotion_id}  at  promotion_model.js`)
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with promotion_id = ${promotion_id}  at  promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('provider_id', `${err.message}`)
        }
    }

    async create(equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end) {
        try {
            console.log({ equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end })
            const new_promotion = await db.query(`INSERT INTO promotions_equipment(
                equipmentprovider_id, title, discount,
                booking_start, booking_end, activity_start, activity_end)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`, [equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end])
            return new_promotion
        } catch (err) {
            console.log(err, `-----> err  in create function   at promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create promotion', `${err.message}`)
        }
    }

    async update(promotion_id, equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end) {
        try {
            console.log({ promotion_id, equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end })
            const updated_promotion = await db.query(`
            UPDATE promotions_equipment
            SET equipmentprovider_id=$1, title=$2, discount=$3,
            booking_start=$4, booking_end=$5, activity_start=$6, activity_end=$7
            WHERE id = $8
            RETURNING *;`, [equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end, promotion_id])
            return updated_promotion
        } catch (err) {
            console.log(err, `-----> err  in update function   at promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('update promotion', `${err.message}`)
        }
    }

    async activate(promotion_id, is_active) {
        try {
            console.log(promotion_id)
            const activated_promotion = await db.query(`UPDATE promotions_equipment
            SET is_active = $2
            WHERE id = $1
            RETURNING *;`, [promotion_id, is_active])
            return activated_promotion
        } catch (err) {
            console.log(err, `-----> err  in activate function   at promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete promotion', `${err.message}`)
        }
    }

    async delete(promotion_id) {
        try {
            console.log(promotion_id)
            const deleted_promotion = await db.query(`DELETE FROM promotions_equipment
            WHERE id = $1
            RETURNING *;`, [promotion_id])
            return deleted_promotion
        } catch (err) {
            console.log(err, `-----> err  in delete function   at promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete promotion', `${err.message}`)
        }
    }


    async findOne(promotion_id) {
        try {
            console.log(promotion_id)
            const one_promotion = await db.query(`SELECT id AS promotion_id,
            equipmentprovider_id, title, discount, booking_start, booking_end,
            activity_start, activity_end
            FROM promotions_equipment
            WHERE id = ${promotion_id};`)
            return one_promotion
        } catch (err) {
            console.log(err, `-----> err  in findOne function   at promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('find one promotion', `${err.message}`)
        }
    }

    async findAll({ state, sortBy, limit, offset, s }) {
        try {
            let sort_by_field = 'id'
            let sort_by_direction = 'ASC'
            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let sql_query = `SELECT id AS promotion_id,
            equipmentprovider_id, title, discount, booking_start, booking_end,
            activity_start, activity_end  FROM promotions_equipment `
            const where = `WHERE `
            let condition = ''
            const state_condition = `is_active = 'true' `
            let search_condition = `equipmentprovider_id = ${s}`;

            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(id) AS count FROM promotions_equipment '
            const and = 'AND '
            const end = '; '

            if (state) {
                condition += state_condition + and + search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else {
                condition += search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            }

            console.log(sql_query, `-----> sql_query  in findAll function  at promotion_model.js`)
            const all_promotions = await db.query(sql_query)
            return all_promotions

            // const sql = `SELECT id AS promotion_id,
            // equipmentprovider_id, title, discount, booking_start, booking_end,
            // activity_start, activity_end
            // FROM promotions_equipment
            // WHERE equipmentprovider_id = ${equipmentprovider_id};`

        } catch (err) {
            console.log(err, `-----> err  in findAll function   at promotion_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('find all promotions of equipment', `${err.message}`)
        }
    }
}

const promotionmodel = new PromotionModel();
export { promotionmodel };
