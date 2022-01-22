import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class EquipmentModel {


    async create (equipment_name, activity_id,  capacity) {
        try {      
            // console.log(equipment_name, activity_id, capacity, ' -----> equipment_name, activity_id, capacityin create function  at equipment_model.js') 
            const new_equipment = await db.query(`INSERT INTO equipments 
            (equipment_name, activity_id, capacity) 
            VALUES ($1, $2, $3) 
            RETURNING *;`, [equipment_name, activity_id, capacity])
            return new_equipment
        } catch (err) {                                       
            console.log(err, `-----> err in create function with equipment_name = ${equipment_name}  at equipment_model.js`)                                                                  
            throw new Api500Error( 'equipment_name', `${err.message}`)                                                                  
        }
    }


    async update (equipment_name, equipment_id, capacity) {        
        try {
            const updated_equipment = await db.query(`UPDATE equipments
            SET equipment_name = $1, capacity = $2 WHERE equipments.id = $3 RETURNING *;`,
            [equipment_name, capacity, equipment_id])
            return updated_equipment
        }catch(err){                                       
            console.log(err, `-----> err in update function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipment_id', `${err.message}`)                                                                  
        }
    }

    async activate(equipment_id, active) {
        try {
            // console.log(equipment_id, active)
            const activated_equipment = await db.query(`UPDATE equipments
            SET active = $1 WHERE id = $2 RETURNING *;`,
            [active, equipment_id])
            return  activated_equipment
        }catch(err) {                                       
            console.log(err, `-----> err in activate function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'equipment_id', `${err.message}`)                                                                  
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
            throw new Api500Error( 'equipment_id', `${err.message}`)                                                                 
        }
    }

    async getOne(equipment_id) {
        try {
            const sql_query = `SELECT id AS equipment_id, equipment_name 
            FROM equipments WHERE id = ${equipment_id};`
            const one_equipment = await db.query(sql_query)
            return one_equipment
        } catch (err) {                                       
            console.log(err, `-----> err  in getOne function with equipment_id = ${equipment_id}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipment_id', `${err.message}`)                                                                  
        }  
    }

    async getAll(equipment_name) {           
        try {
            const sql_query = `SELECT id AS equipment_id, equipment_name 
            FROM equipments WHERE equipment_name LIKE '%'||'${equipment_name}'||'%';`
            const all_equipments = await db.query(sql_query)
            return all_equipments
        } catch (err) {                                       
            console.log(err, `-----> err  in getAll function with equipment_name = ${equipment_name}  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipment_name', `${err.message}`)                                                                  
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

    async getSearch(body) {
        try {
            const { 
                location,
                acitvity_name,
                date_start,
                date_end,
                time_start,
                time_end,
                capacity,
                price_start,
                price_end,
                max_distance_from_center,
                services,
                equipment_id,
                short
            } = body
            let array_equipment_id = ['0'] // Проблема: будет работать только от 1 до 9
            if (equipment_id !== undefined){
                for(let i=0; i<equipment_id.length; i++){
                    array_equipment_id.push(equipment_id[i])
                }
            }

            let array_services = ['0'] // Проблема: будет работать только от 1 до 9
            if (services !== undefined){
                for(let i=0; i<services.length; i++){
                    array_services.push(services[i])
                }
            }

            console.log(array_equipment_id, '----> array_equipment_id')
            console.log(array_services, '----> array_services')            
            
            console.log(equipment_id, typeof(equipment_id), " ---> equipment_id")
            console.log(typeof(services), services, '---> servises in getSearch at equipment_model ')

            const sql_begining_query = `SELECT  prv.id, provider_name, 
            location, address, distance_from_center as to_center, rating, 
            (SELECT COUNT(f.id) as feedbacks FROM feedbacks f
            WHERE prv.id = f.provider_id), 
            eqt.id as equipment_id, eqpr.id as eqr_id, eqt.equipment_name,  eqpr.quantity,
            eqpr.quantity - (SELECT  COUNT(bk.equipmentprovider_id) as taken   FROM bookings bk 
                WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
                (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
                AND  bk.equipmentprovider_id = eqpr.id)  as avaliable, 
            MIN(frs.fare) as start_price
            FROM providers prv
            LEFT JOIN services_providers s_p 
                    ON prv.id = s_p.provider_id  
            LEFT JOIN equipmentsproviders eqpr 
                ON  prv.id = eqpr.provider_id 
            LEFT JOIN equipments eqt  
                ON eqpr.equipment_id = eqt.id
            LEFT JOIN fares frs
                ON eqpr.id = frs.equipmentprovider_id
            WHERE 
            distance_from_center < ${max_distance_from_center}
            AND location != '${location}' AND eqt.id in (${array_equipment_id})
            AND frs.fare = (SELECT MIN(frs.fare) FROM fares frs 
                WHERE frs.equipmentprovider_id = eqpr.id  AND frs.fare >= ${price_start}  AND frs.fare <= ${price_end})
            AND eqpr.id  not in
                (SELECT bk.equipmentprovider_id FROM bookings bk 
                WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
                (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
                AND  bk.equipmentprovider_id = eqpr.id
                AND eqpr.quantity <
                    (SELECT  COUNT(bk.equipmentprovider_id)   FROM bookings bk 
                    WHERE (bk.activity_start,  bk.activity_end)  OVERLAPS 
                    (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
                    AND  bk.equipmentprovider_id = eqpr.id) 
                )`;

            const sql_services_query = ` AND s_p.service_id  in (${array_services}) `;
            const sql_ending_query = ` GROUP BY prv.id, eqt.id, eqt.equipment_name, eqpr.id, eqpr.quantity;`;
            let sql_query = ``        
            if ( services == undefined) {
                sql_query = sql_begining_query + sql_ending_query;
            } else {
                sql_query = sql_begining_query + sql_services_query + sql_ending_query;
            }

            const get_equipments = await db.query(sql_query)

            // [ acitvity_name, capacity, price_start, price_end, short]
            // console.log(sql_query)
            
            console.log(get_equipments.rows)
            return get_equipments
        }catch(err) {                                       
            console.log(err, `-----> err  in getSearch function  at equipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipment_id', `${err.message}`)                                                                  
        } 
    }

    async isExist(equipment_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE id = ${equipment_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with equipment_id = ${equipment_id}  at  activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'equipment_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(equipment_name) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE equipment_name = '${equipment_name}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with equipment_name = ${equipment_name}  in activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipment_name', `${err.message}`)                                                                
        }
    }
}

const equipmentmodel = new EquipmentModel();
export { equipmentmodel };