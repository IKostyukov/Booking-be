import { pool } from '../db.js';
const db = pool

class ActivitiesRequestModel {
    
    async create (req, res) {
        const {activity_name} = req.body
        const new_activity = await db.query(`INSERT INTO activities 
        (activity_name) VALUES ($1) RETURNING *;`, [activity_name])
        return new_activity
    }

    async update (req, res) {
        const {activity_id, active, activity_name } = req.body
        //  Нужно проверку на получение результатов от БД.  Вариант  - нет такой активности
        const updated_activity = await db.query(`UPDATE activities 
        SET active = $1, activity_name = $2 WHERE id = $3 RETURNING *;`,
        [active, activity_name, activity_id])
        return updated_activity
    }

    async activate(req, res) {
        const {activity_id, active} = req.body
        const activated_activity = await db.query(`UPDATE activities
        SET active = $2 WHERE id = $1 RETURNING *;`,
        [ activity_id, active])
        return  activated_activity
    }

    async delete(req, res) {
        const { activity_id } = req.body
        const deleted_activity = await db.query(`DELETE FROM activities WHERE id = $1
        RETURNING *;`, [activity_id])
        return deleted_activity
    }

    async getOneActivity(req, res) {
        const { activity_id } = req.body
        const sql_query = `SELECT id AS activity_id, activity_name 
        FROM activities WHERE id = ${activity_id};`
        const one_activity = await db.query(sql_query)
        return one_activity
    }

    async getAllActivities(req, res) {
        const { activity_name } = req.body    
        const sql_query = `SELECT id AS activity_id, activity_name 
        FROM activities WHERE activity_name = '${activity_name}';`
        const all_activitirs = await db.query(sql_query)
        return all_activitirs
    }

    async getPopular(req, res) {
        const sql_query = `SELECT  
        COUNT(b.id) as orders, activity_name, 
        MIN(f.fare) as start_price
        FROM activities a 
        LEFT JOIN equipments e ON a.id = e.activity_id 
        LEFT JOIN equipments_recreationalfacilities r 
            ON e.id = r.equipment_id 
        LEFT JOIN bookings b 
            ON r.id = b.equipment_recreationalfacility_id 
        LEFT JOIN fares f  
            ON f.equipment_recreationalfacility_id = b.equipment_recreationalfacility_id 
        WHERE f.fare = 
                (SELECT MIN(f.fare) FROM fares f 
                WHERE f.equipment_recreationalfacility_id = b.equipment_recreationalfacility_id )
        GROUP BY activity_name
        ORDER BY orders DESC LIMIT 3;`
        const popular_activities = await db.query(sql_query)
        return popular_activities
    }
}

const activities = new ActivitiesRequestModel();
export {activities};

