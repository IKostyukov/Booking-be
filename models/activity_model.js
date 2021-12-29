import { pool } from '../db.js';
// import { validation } from '../validation/body_activity_validation.js';
const db = pool

class ActivityModel {

    // async validate (activity_name) {
    //     if (validation.isString(activity_name)){
    //         return true
    //     }else{return error}
    // }
    
    async create (activity_name) {

        const new_activity = await db.query(`INSERT INTO activities 
        (activity_name) VALUES ($1) RETURNING *;`, [activity_name])
        return new_activity
    }

    async update (activity_id, activity_name) {        
        //  Нужно проверку на получение результатов от БД.  Вариант  - нет такой активности
        const updated_activity = await db.query(`UPDATE activities 
        SET activity_name = $1 WHERE id = $2 RETURNING *;`,
        [activity_name, activity_id])
        return updated_activity
    }

    async activate(activity_id, active) {        
        const activated_activity = await db.query(`UPDATE activities
        SET active = $2 WHERE id = $1 RETURNING *;`,
        [ activity_id, active])
        return  activated_activity
    }

    async delete(activity_id) {
        const deleted_activity = await db.query(`DELETE FROM activities WHERE id = $1
        RETURNING *;`, [activity_id])
        return deleted_activity
    }

    async getOne(activity_id) {
        const sql_query = `SELECT id AS activity_id, activity_name 
        FROM activities WHERE id = ${activity_id};`
        const one_activity = await db.query(sql_query)
        return one_activity
    }

    async getAll(activity_name) {
        const sql_query = `SELECT id AS activity_id, activity_name 
        FROM activities WHERE activity_name LIKE '%'||'${activity_name}'||'%' ;`
        const all_activitirs = await db.query(sql_query)
        return all_activitirs
    }

     // WHERE first_name LIKE '%'||$1||'%' OR last_name LIKE '%'||$2||'%' OR email LIKE '%'||$3||'%'
    //     OR phone LIKE '%'||$4||'%' ;`, [first_name, last_name, email, phone ])


    async getPopular() {
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
    }
}

const activity = new ActivityModel();
export {activity};

