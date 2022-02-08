import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class TimetableModel {

    // ### График работы ####

    async isExist(timetable_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM timetables WHERE id = ${timetable_id}) AS "exists";`
            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, '----> is_exist. rows in isExist function with timetable_id = ${timetable_id}  at  timetable_model.js')
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with timetable_id = ${timetable_id}  at  timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('provider_id', `${err.message}`)
        }
    }

    async create(timetable) {
        try {
            let sql = `INSERT INTO timetables 
            (monday_start_time, monday_end_time, tuesday_start_time, tuesday_end_time, 
            wednesday_start_time, wednesday_end_time, thursday_start_time, thursday_end_time,
            friday_start_time, friday_end_time, saturday_start_time, saturday_end_time, 
            sunday_start_time, sunday_end_time)
            VALUES (`;
            for (let i = 0; i < timetable.length; i++) {
                sql += ` '${timetable[i].start_time}', '${timetable[i].end_time}',`
            }
            sql = sql.slice(0, -1)
            sql += ') RETURNING *;'

            console.log(sql, ' <-------- sql')
            const new_timetable = await db.query(sql)
            console.log(new_timetable.rows)
            return new_timetable
        } catch (err) {
            console.log(err, `-----> err  in create function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create timetable', `${err.message}`)
        }
    }


    async update(timetable_id, timetable) {
        try {
            console.log(timetable_id, timetable)
            let sql = `UPDATE timetables
            SET  monday_start_time = '${timetable[0].start_time}', monday_end_time = '${timetable[0].start_time}', tuesday_start_time = '${timetable[1].start_time}', tuesday_end_time = '${timetable[1].start_time}', 
            wednesday_start_time = '${timetable[2].start_time}', wednesday_end_time ='${timetable[2].start_time}', thursday_start_time ='${timetable[3].start_time}', thursday_end_time =' ${timetable[3].start_time}',
            friday_start_time = '${timetable[4].start_time}', friday_end_time = '${timetable[4].start_time}', saturday_start_time = '${timetable[5].start_time}', saturday_end_time = '${timetable[5].start_time}', 
            sunday_start_time = '${timetable[6].start_time}', sunday_end_time = '${timetable[6].start_time}' 
            WHERE  id = ${timetable_id}
            RETURNING *;`

            console.log(sql, `-----> sql  in update function   at timetable_model.js`)
            const updated_timetable = await db.query(sql)
            return updated_timetable
        } catch (err) {
            console.log(err, `-----> err  in update function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('update timetable', `${err.message}`)
        }
    }

    async delete(timetable_id) {
        try {
            console.log(timetable_id)
            const deleted_timetable = await db.query(`DELETE FROM  timetables
            WHERE  id = $1
            RETURNING *;`, [timetable_id])
            return deleted_timetable
        } catch (err) {
            console.log(err, `-----> err  in delete function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete timetable', `${err.message}`)
        }
    }

    async get(timetable_id) {
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
            console.log(err, `-----> err  in get function   at timetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get timetable', `${err.message}`)
        }
    }
}

const timetablemodel = new TimetableModel()
export { timetablemodel }