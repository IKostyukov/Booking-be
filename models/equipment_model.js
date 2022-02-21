import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class EquipmentModel {

    async create(equipment_name, activity_id, capacity) {
        try {
            // console.log(equipment_name, activity_id, capacity, ' -----> equipment_name, activity_id, capacityin create function  at equipment_model.js') 
            const new_equipment = await db.query(`INSERT INTO equipments 
            (equipment_name, activity_id, capacity) 
            VALUES ($1, $2, $3) 
            RETURNING *;`, [equipment_name, activity_id, capacity])
            return new_equipment
        } catch (err) {
            console.log(err, `-----> err in create function with equipment_name = ${equipment_name}  at equipment_model.js`)
            throw new Api500Error('equipment_name', `${err.message}`)
        }
    }


    async update(equipment_name, equipment_id, capacity) {
        try {
            const updated_equipment = await db.query(`UPDATE equipments
            SET equipment_name = $1, capacity = $2 WHERE equipments.id = $3 RETURNING *;`,
                [equipment_name, capacity, equipment_id])
            return updated_equipment
        } catch (err) {
            console.log(err, `-----> err in update function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async activate(equipment_id, active) {
        try {
            // console.log(equipment_id, active)
            const activated_equipment = await db.query(`UPDATE equipments
            SET active = $1 WHERE id = $2 RETURNING *;`,
                [active, equipment_id])
            return activated_equipment
        } catch (err) {
            console.log(err, `-----> err in activate function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async delete(equipment_id) {
        try {
            const deleted_equipment = await db.query(`DELETE FROM equipments WHERE id = $1
            RETURNING *;`, [equipment_id])
            return deleted_equipment
        } catch (err) {
            console.log(err, `-----> error  in delete function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async findOne(equipment_id) {
        try {
            const sql_query = `SELECT id AS equipment_id, equipment_name 
            FROM equipments WHERE id = ${equipment_id};`
            const one_equipment = await db.query(sql_query)
            return one_equipment
        } catch (err) {
            console.log(err, `-----> err  in findOne function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async findAll({ state, sortBy, limit, offset, s }) {
        try {
            console.log({ state, sortBy, limit, offset, s })
            let sort_by_field = 'id'
            let sort_by_direction = 'ASC'

            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let sql_query = `SELECT id AS equipment_id, equipment_name  FROM equipments `
            let condition = ''

            const where = `WHERE `
            const state_condition = `active = 'true' `
            const search_condition = `equipment_name LIKE '%'||'${s}'||'%' `
            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(id) AS count FROM equipments '
            const and = 'AND '
            const end = '; '

            if (state && s) {
                condition += state_condition + and + search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else if (state) {
                condition += state_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else if (s) {
                condition += search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else {
                sql_query += filter + end + query_count + end
            }

            console.log(sql_query, `-----> sql_query  in findAll function with ${s}  at activiy_model.js`)
            const all_activitirs = await db.query(sql_query)
            return all_activitirs
        } catch (err) {
            console.log(err, `-----> err  in findAll function with equipment_name = ${equipment_name}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_name', `${err.message}`)
        }
    }

    // 1 location: String,
    // 2 acitvity_name: String,
    // 3 date_start: Int,
    // 4 date_end: Int,
    // 5 time_start: Int,
    // 6 time_end: Int,
    // 7 capacity: Int,
    // 8 price_start: Int,
    // 9 price_end: Int,
    // 10 max_distance_from_center: Int,
    // 11 services: [Int],
    // 12 equipment_id: [Int],
    // 13 short: Boolean

    async searchAll(query, limit, offset) {
        try {
            const {
                state,
                sortBy,
                location, // сейчас на sql  указано location != ${location} для более многочисленных результатов поиска
                acitvity_name, // не используется
                date_start,
                date_end,
                time_start,
                time_end,
                capacity, // не используется
                price_start,
                price_end,
                max_distance_from_center,
                services,
                equipment_id,
                short // не используется
            } = query;

            console.log(equipment_id, typeof (equipment_id), " ---> equipment_id");
            console.log(typeof (services), services, '---> servises in getSearch at equipment_model ');

            let sort_by_field = 'id';
            let sort_by_direction = 'ASC';

            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field;
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction;
            }

            let sql_query = `SELECT  prv.id, provider_name, 
            location, address, distance_from_center as to_center, rating, 
            (SELECT COUNT(f.id) as feedbacks FROM feedbacks f
            WHERE prv.id = f.provider_id), 
            eqt.id as equipment_id, eqpr.id as eqr_id, eqt.equipment_name,  eqpr.quantity,  MIN(frs.fare) as start_price, `;

            const availiable_quantity = `eqpr.quantity - (SELECT  COUNT(bk.equipmentprovider_id) as taken   FROM bookings bk 
            WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
            (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
            AND  bk.equipmentprovider_id = eqpr.id)  as avaliable `;

            const total_quantity = `eqpr.quantity `;

            const fromm = ` FROM providers prv
            LEFT JOIN services_providers s_p 
                    ON prv.id = s_p.provider_id  
            LEFT JOIN equipmentsproviders eqpr 
                ON  prv.id = eqpr.provider_id 
            LEFT JOIN equipments eqt  
                ON eqpr.equipment_id = eqt.id
            LEFT JOIN fares frs
                ON eqpr.id = frs.equipmentprovider_id `;

            const where = `WHERE `;

            let total_condition = `prv.id > 0 `; // искуственное единственное  обязательное условие для удобства дальнейшей конкатинации AND в начале каждой строки

            const state_condition = `eqpr.active = 'true' `;

            const location_condition = `location  LIKE '%'||'${location}'||'%' `;

            const distance_condition = ` distance_from_center < ${max_distance_from_center} `;

            const equipments_condition = `eqt.id in (${equipment_id})  `;

            const price_condition = `frs.fare = (SELECT MIN(frs.fare) FROM fares frs 
            WHERE frs.equipmentprovider_id = eqpr.id  AND frs.fare >= ${price_start}  AND frs.fare <= ${price_end}) `;

            const avaliable_condition = `eqpr.id  not in
            (SELECT bk.equipmentprovider_id FROM bookings bk 
                WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
                (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
                AND  bk.equipmentprovider_id = eqpr.id
                AND eqpr.quantity <
                    (SELECT  COUNT(bk.equipmentprovider_id)   FROM bookings bk 
                    WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
                    (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
                    AND  bk.equipmentprovider_id = eqpr.id) ) `;

            const services_condition = ` s_p.service_id  in (${services}) `;

            const group_by = ` GROUP BY prv.id, eqt.id, eqt.equipment_name, eqpr.id, eqpr.quantity `;

            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `;

            const and = 'AND ';

            const end = '; ';

            const query_count = ' SELECT COUNT( prv.id) AS count ';

            if (state) {
                total_condition += and + state_condition;
            }
            if (location) {
                total_condition += and + location_condition;
            }
            if (max_distance_from_center) {
                total_condition += and + distance_condition;
            }
            if (equipment_id) {
                total_condition += and + equipments_condition;
            }
            if (max_distance_from_center) {
                total_condition += and + distance_condition;
            }
            if (price_start && price_end) {
                total_condition += and + price_condition;
            }
            if (date_start && time_start && date_end && time_end) {
                total_condition += and + avaliable_condition;
                sql_query += availiable_quantity;
            } else {
                sql_query += total_quantity;
            }
            if (services) {
                total_condition += and + services_condition;
            }

            sql_query += fromm + where + total_condition + group_by + filter + end + query_count + fromm + where + total_condition + end;
            console.log(sql_query);

            const get_equipments = await db.query(sql_query);
            // [ acitvity_name, capacity, price_start, price_end, short]
            console.log(get_equipments[1].rows, ' ---> count');
            return get_equipments;
        } catch (err) {
            console.log(err, `-----> err  in searchAll function  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    // Первоначальный рабочий вариант 

    // const sql_begining_query = `SELECT  prv.id, provider_name, 
    // location, address, distance_from_center as to_center, rating, 
    // (SELECT COUNT(f.id) as feedbacks FROM feedbacks f
    // WHERE prv.id = f.provider_id), 
    // eqt.id as equipment_id, eqpr.id as eqr_id, eqt.equipment_name,  eqpr.quantity,
    // eqpr.quantity - (SELECT  COUNT(bk.equipmentprovider_id) as taken   FROM bookings bk 
    //     WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
    //     (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
    //     AND  bk.equipmentprovider_id = eqpr.id)  as avaliable, 
    // MIN(frs.fare) as start_price
    // FROM providers prv
    // LEFT JOIN services_providers s_p 
    //         ON prv.id = s_p.provider_id  
    // LEFT JOIN equipmentsproviders eqpr 
    //     ON  prv.id = eqpr.provider_id 
    // LEFT JOIN equipments eqt  
    //     ON eqpr.equipment_id = eqt.id
    // LEFT JOIN fares frs
    //     ON eqpr.id = frs.equipmentprovider_id
    // WHERE 
    // distance_from_center < ${max_distance_from_center}
    // AND location != '${location}' AND eqt.id in (${equipment_id})
    // AND frs.fare = (SELECT MIN(frs.fare) FROM fares frs 
    //     WHERE frs.equipmentprovider_id = eqpr.id  AND frs.fare >= ${price_start}  AND frs.fare <= ${price_end})
    // AND eqpr.id  not in
    //     (SELECT bk.equipmentprovider_id FROM bookings bk 
    //     WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
    //     (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
    //     AND  bk.equipmentprovider_id = eqpr.id
    //     AND eqpr.quantity <
    //         (SELECT  COUNT(bk.equipmentprovider_id)   FROM bookings bk 
    //         WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
    //         (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
    //         AND  bk.equipmentprovider_id = eqpr.id) 
    //     )`;

    // const sql_services_query = ` AND s_p.service_id  in (${services}) `;
    // const sql_ending_query = ` GROUP BY prv.id, eqt.id, eqt.equipment_name, eqpr.id, eqpr.quantity;`;
    // let sql_query = ``        
    // if ( services == undefined) {
    //     sql_query = sql_begining_query + sql_ending_query;
    // } else {
    //     sql_query = sql_begining_query + sql_services_query + sql_ending_query;
    // }

    // const get_equipments = await db.query(sql_query)

    // // [ acitvity_name, capacity, price_start, price_end, short]
    // // console.log(sql_query)

    // console.log(get_equipments.rows)
    // return get_equipments



    async isExist(equipment_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE id = ${equipment_id}) AS "exists";`
        try {
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with equipment_id = ${equipment_id}  at  activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async isUnique(equipment_name) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE equipment_name = '${equipment_name}') AS "exists";`
        try {
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isUnique function with equipment_name = ${equipment_name}  in activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_name', `${err.message}`)
        }
    }
}

const equipmentmodel = new EquipmentModel();
export { equipmentmodel };