import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';


const db = pool

class ActivityModel {

    
    async create (activity_name) {
        try{
            const new_activity = await db.query(`INSERT INTO activities 
                (activity_name) VALUES ($1) RETURNING *;`, [activity_name])
            return new_activity
        } catch (err) {                                       
            console.log(err, `-----> err in create function with activity_name = ${activity_name}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_name', `${err.message}`)                                                                  
        }
    }

    async update (activity_id, activity_name) {        
        try{
            const updated_activity = await db.query(`UPDATE activities 
                SET activity_name = $1 WHERE id = $2 RETURNING *;`,[activity_name, activity_id])
            return updated_activity
        } catch (err) {                                       
            console.log(err, `-----> err in update function with activity_id = ${activity_id}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                  
        }
    }

    async activate(activity_id, active) {     
        try{   
            const activated_activity = await db.query(`UPDATE activities
                SET active = $2 WHERE id = $1 RETURNING *;`,[ activity_id, active])
            return  activated_activity
        } catch (err) {                                       
            console.log(err, `-----> err in activate function with activity_id = ${activity_id}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                  
        }
    }

    async delete(activity_id) {
        try{
            const deleted_activity = await db.query(`DELETE FROM activities WHERE id = $1
                RETURNING *;`, [activity_id])
            return deleted_activity
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with activity_id = ${activity_id}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                 
        }
    }

    async getOne(activity_id) {
        try{
            const sql_query = `SELECT id AS activity_id, activity_name 
                FROM activities WHERE id = ${activity_id};`
            const one_activity = await db.query(sql_query)
            return one_activity
        } catch (err) {                                       
            console.log(err, `-----> err  in getOne function with activity_id = ${activity_id}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                  
        }        
    }

    async getAll({ activity_name, sortBy, limit, offset }) {
        try {
            console.log({ activity_name, sortBy, limit, offset })
            let sql_query = `SELECT id 
                AS activity_id, activity_name 
                FROM activities 
                WHERE activity_name 
                LIKE '%'||'${activity_name}'||'%' 
                ORDER BY ${sortBy[0].field} ${sortBy[0].direction} 
                LIMIT ${limit} 
                OFFSET ${offset};
                SELECT COUNT(id) 
                AS count
                FROM activities 
                WHERE activity_name 
                LIKE '%'||'${activity_name}'||'%';`

            // if (sortBy) {
            //     const sql_end = `ORDER BY ${sortBy[0].field} ${sortBy[0].direction} LIMIT ${limit} OFFSET ${offset};`
            //     sql_query += sql_end
            // } else {
            //     const sql_end = ';'
            //     sql_query += sql_end
            // }
            console.log(sql_query, `-----> sql_query  in getAll function with activity_name = ${activity_name}  at activiy_model.js`)

            const all_activitirs = await db.query(sql_query)
            return all_activitirs
        } catch (err) {                                       
            console.log(err, `-----> err  in getAll function with activity_name = ${activity_name}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_name', `${err.message}`)                                                                  
        }        
    }

    async getPopular() {
        try{
            const sql_query = `SELECT  
                COUNT(b.id) as orders, activity_name, 
                MIN(f.fare) as start_price
                FROM activities a 
                LEFT JOIN equipments e 
                ON a.id = e.activity_id 
                LEFT JOIN equipmentsproviders r 
                ON e.id = r.equipment_id 
                LEFT JOIN bookings b 
                ON r.id = b.equipmentprovider_id 
                LEFT JOIN fares f  
                ON f.equipmentprovider_id = b.equipmentprovider_id 
                WHERE f.fare = 
                        (SELECT MIN(f.fare) FROM fares f 
                        WHERE f.equipmentprovider_id = b.equipmentprovider_id )
                GROUP BY activity_name
                ORDER BY orders DESC LIMIT 3;`
            const popular_activities = await db.query(sql_query)
            return popular_activities
        } catch (err) {                                       
            console.log(err, `-----> err in getPopular function at activiy_model.js`)
            throw new Api500Error( 'getPopular', `${err.message}`)                                                                  
        }
    }

    
    async isExist(activity_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM activities WHERE id = ${activity_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with activity_id = ${activity_id}  at  activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(activity_name) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM activities WHERE activity_name = '${activity_name}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with activity_name = ${activity_name}  in activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_name', `${err.message}`)                                                                
        }
    }
}

const activity = new ActivityModel();
export {activity};

