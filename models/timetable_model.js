import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class TimetableModel {

    // ### График работы ####
 
    async createNewTimetable (timetable) {
        try{
            let sql = `INSERT INTO timetables 
            (monday_start_time, monday_end_time, tuesday_start_time, tuesday_end_time, 
            wednesday_start_time, wednesday_end_time, thursday_start_time, thursday_end_time,
            friday_start_time, friday_end_time, saturday_start_time, saturday_end_time, 
            sunday_start_time, sunday_end_time)
            VALUES (`;
            for (let i = 0; i < timetable.length; i++){
                sql += ` '${timetable[i].start_time}', '${timetable[i].end_time}',`
            }
            sql = sql.slice(0, -1)
            sql += ') RETURNING *;'  

            // console.log(sql, ' <-------- sql')
            const new_timetable = await db.query(sql)
            console.log(new_timetable.rows) 
            return new_timetable 
        } catch (err) {                                       
            console.log(err, `-----> err  in createNewTimetable function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'create timetable', `${err.message}`)                                                                  
        } 
    }

    
    async updateOneTimetable (timetable_id, start_time, end_time) {
        try {
            console.log(timetable_id) 
            const updated_timetable = await db.query(`UPDATE timetables
            SET  monday_start_time=$1, monday_end_time=$2, tuesday_start_time=$1, tuesday_end_time=$2, 
            wednesday_start_time=$1, wednesday_end_time=$2, thursday_start_time=$1, thursday_end_time=$2,
            friday_start_time=$1, friday_end_time=$2, saturday_start_time=$1, saturday_end_time=$2, 
            sunday_start_time=$1, sunday_end_time=$2 
            WHERE  id = $3
            RETURNING *;`, [start_time, end_time, timetable_id])
            return updated_timetable
        } catch (err) {                                       
            console.log(err, `-----> err  in createNewTimetable function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'create timetable', `${err.message}`)                                                                  
        } 
    }
       
    async deleteOneTimetable(timetable_id) {
        try {
            console.log(timetable_id) 
            const deleted_timetable = await db.query(`DELETE FROM  timetables
            WHERE  id = $1
            RETURNING *;`, [timetable_id])
            return deleted_timetable
        } catch (err) {                                       
            console.log(err, `-----> err  in createNewTimetable function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'create timetable', `${err.message}`)                                                                  
        } 
    }

    async getOneTimetable(timetable_id) {
        try {
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
        } catch (err) {                                       
            console.log(err, `-----> err  in createNewTimetable function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'create timetable', `${err.message}`)                                                                  
        } 
    }
}

    const timetablemodel = new TimetableModel()
    export { timetablemodel } 