import { pool } from '../db.js';
const db = pool

class TimetableModel {

   

    // ### График работы ####
 
    async createNewTimetable (start_time, end_time) {

        //  Нужно в контроллере получитв массив объектов передать его в модель сюда
        // И здесть проитерироваться по массиву и создать строку запроса SQL 
        // содержащую поля для всех дней недели 
        //  Потом строку передать в запрос к Базе
        
        // console.log(req.body)
        // const {start_time, end_time} = req.body
        console.log(start_time, end_time)
        const new_timetable = await db.query(`INSERT INTO timetables 
            (monday_start_time, monday_end_time, tuesday_start_time, tuesday_end_time, 
            wednesday_start_time, wednesday_end_time, thursday_start_time, thursday_end_time,
            friday_start_time, friday_end_time, saturday_start_time, saturday_end_time, 
            sunday_start_time, sunday_end_time)
            VALUES ($1, $2, $1, $2, $1, $2, $1, $2, $1, $2, $1, $2, $1, $2)
            RETURNING *;`, [start_time, end_time])
        // console.log(new_timetable) 
        return new_timetable 
    }

    
    async updateOneTimetable (timetable_id, start_time, end_time) {
        console.log(timetable_id) 
        const updated_timetable = await db.query(`UPDATE timetables
        SET  monday_start_time=$1, monday_end_time=$2, tuesday_start_time=$1, tuesday_end_time=$2, 
        wednesday_start_time=$1, wednesday_end_time=$2, thursday_start_time=$1, thursday_end_time=$2,
        friday_start_time=$1, friday_end_time=$2, saturday_start_time=$1, saturday_end_time=$2, 
        sunday_start_time=$1, sunday_end_time=$2 
        WHERE  id = $3
        RETURNING *;`, [start_time, end_time, timetable_id])
        return updated_timetable
       }
       
    async deleteOneTimetable(timetable_id) {
        console.log(timetable_id) 
        const deleted_timetable = await db.query(`DELETE FROM  timetables
        WHERE  id = $1
        RETURNING *;`, [timetable_id])
        return deleted_timetable
       }

    async getOneTimetable(timetable_id) {
            const sql_query = `SELECT  
            id AS timetable_id,
            monday_start_time,
            monday_end_time,
            tuesday_start_time,
            tuesday_end_time,
            wednesday_start_time,
            wednesday_end_time,
            thursday_start_time,
            thursday_end_time,
            friday_start_time,
            friday_end_time,
            saturday_start_time,
            saturday_end_time,
            sunday_start_time,
            sunday_end_time
            FROM timetables WHERE id = ${timetable_id};`
            const one_timetable = await db.query(sql_query)
            return one_timetable
        }
}

    const timetablemodel = new TimetableModel()
    export { timetablemodel } 