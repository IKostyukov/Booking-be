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

    async findOne(activity_id) {
        try{
            const sql_query = `SELECT id AS activity_id, activity_name 
                FROM activities WHERE id = ${activity_id};`
            const one_activity = await db.query(sql_query)
            return one_activity
        } catch (err) {                                       
            console.log(err, `-----> err  in findOne function with activity_id = ${activity_id}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                  
        }        
    }

    async findAll({state,  s, sortBy, limit, offset }) {
        try {
            console.log({ state, sortBy, limit, offset, s })
            let sort_by_field = 'id'
            let sort_by_direction = 'ASC'

            if ( sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if ( sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let sql_query = `SELECT id AS activity_id, activity_name FROM activities `
            let condition = ''

            const where = `WHERE `
            const state_condition = `active = 'true' `
            const search_condition = `activity_name LIKE '%'||'${s}'||'%' `
            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(id) AS count FROM activities '
            const and = 'AND '
            const end = '; '
        
            if ( state && s ){
                condition +=  state_condition + and + search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            }else if (state) {
                condition += state_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else if ( s ) {
                condition += search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else {
                sql_query +=  filter + end + query_count + end  
            }

            console.log(sql_query, `-----> sql_query  in findAll function with ${s}  at activiy_model.js`)
            const all_activitirs = await db.query(sql_query)
            return all_activitirs
        } catch (err) {                                       
            console.log(err, `-----> err  in findAll function with ${s}  at activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'activity_name', `${err.message}`)                                                                  
        }        
    }

    async findPopular() {
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
            console.log(err, `-----> err in findPopular function at activiy_model.js`)
            throw new Api500Error( 'find popular activities', `${err.message}`)                                                                  
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

