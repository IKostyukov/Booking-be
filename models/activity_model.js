import { pool } from '../db.js';
const db = pool

class ActivityModel {
    
    async create (req, res) {
        const {activity_name} = req.body
        const new_activity = await db.query(`INSERT INTO activities 
        (activity_name) VALUES ($1) RETURNING *;`, [activity_name])
        return new_activity
    }

    async update (req, res) {
        const activity_id = req.params.id
        const {activity_name } = req.body
        //  Нужно проверку на получение результатов от БД.  Вариант  - нет такой активности
        const updated_activity = await db.query(`UPDATE activities 
        SET activity_name = $1 WHERE id = $2 RETURNING *;`,
        [activity_name, activity_id])
        return updated_activity
    }

    async activate(req, res) {
        const activity_id = req.params.id
        const {active} = req.body
        const activated_activity = await db.query(`UPDATE activities
        SET active = $2 WHERE id = $1 RETURNING *;`,
        [ activity_id, active])
        return  activated_activity
    }

    async delete(req, res) {
        const activity_id = req.params.id
        const deleted_activity = await db.query(`DELETE FROM activities WHERE id = $1
        RETURNING *;`, [activity_id])
        return deleted_activity
    }

    async getOne(req, res) {
        const activity_id = req.params.id        
        const sql_query = `SELECT id AS activity_id, activity_name 
        FROM activities WHERE id = ${activity_id};`
        const one_activity = await db.query(sql_query)
        return one_activity
    }

    async getAll(req, res) {
        const { activity_name } = req.body    
        const sql_query = `SELECT id AS activity_id, activity_name 
        FROM activities WHERE activity_name LIKE '%'||'${activity_name}'||'%' ;`
        const all_activitirs = await db.query(sql_query)
        return all_activitirs
    }

     // WHERE first_name LIKE '%'||$1||'%' OR last_name LIKE '%'||$2||'%' OR email LIKE '%'||$3||'%'
    //     OR phone LIKE '%'||$4||'%' ;`, [first_name, last_name, email, phone ])


    async getPopular(req, res) {
        const sql_query = `SELECT  
        COUNT(b.id) as orders, activity_name, 
        MIN(f.fare) as start_price
        FROM activities a 
        LEFT JOIN equipments e ON a.id = e.activity_id 
        LEFT JOIN equipments_recipientofservices r 
            ON e.id = r.equipment_id 
        LEFT JOIN bookings b 
            ON r.id = b.equipment_recipientofservices_id 
        LEFT JOIN fares f  
            ON f.equipment_recipientofservices_id = b.equipment_recipientofservices_id 
        WHERE f.fare = 
                (SELECT MIN(f.fare) FROM fares f 
                WHERE f.equipment_recipientofservices_id = b.equipment_recipientofservices_id )
        GROUP BY activity_name
        ORDER BY orders DESC LIMIT 3;`
        const popular_activities = await db.query(sql_query)
        return popular_activities
    }
}

const activity = new ActivityModel();
export {activity};

