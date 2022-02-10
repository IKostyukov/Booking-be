import { pool } from "../db.js";
import Api500Error from '../errors/api500_error.js';

const db = pool

class ExtratimetableModel {

    // ### Экстрадаты ###

    async isExist(extratimetable_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM extratimetables WHERE id = ${extratimetable_id}) AS "exists";`
            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, '----> is_exist. rows in isExist function with extratimetable_id = ${extratimetable_id}  at  extratimetable_model.js')
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with extratimetable_id = ${extratimetable_id}  at  extratimetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('provider_id', `${err.message}`)
        }
    }

    async create(provider_id, date, start_time, end_time) {
        try {
            console.log(start_time, end_time)
            const new_extratimetable = await db.query(`INSERT INTO extratimetables(
                provider_id, date, start_time, end_time)
                VALUES ($1, $2, $3, $4)
            RETURNING *;`, [provider_id, date, start_time, end_time])
            return new_extratimetable
        } catch (err) {
            console.log(err, `-----> err  in create function   at extratimetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create extratimetable', `${err.message}`)
        }
    }

    async update(extratimetable_id, provider_id, date, start_time, end_time, mtime = 'NOW()') {
        try {
            console.log(start_time, end_time)
            const updsted_extratimetable = await db.query(`UPDATE extratimetables
            SET provider_id=$1, date=$2, start_time=$3, end_time=$4, mtime=$5
            WHERE id = $6
            RETURNING *;`, [provider_id, date, start_time, end_time, mtime, extratimetable_id])
            return updsted_extratimetable
        } catch (err) {
            console.log(err, `-----> err  in update function   at extratimetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('update extratimetable', `${err.message}`)
        }
    }

    async delete(extratimetable_id) {
        try {
            console.log(extratimetable_id)
            const deleted_extratimetable = await db.query(`DELETE FROM extratimetables
            WHERE id = $1
            RETURNING *;`, [extratimetable_id])
            return deleted_extratimetable
        } catch (err) {
            console.log(err, `-----> err  in delete function   at extratimetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete extratimetable', `${err.message}`)
        }
    }


    async getOne(extratimetable_id) {
        try {
            console.log(extratimetable_id)
            const one_extratimetable = await db.query(`SELECT id AS extradate_id,
            provider_id, date
            FROM extratimetables
            WHERE id = ${extratimetable_id};`)
            return one_extratimetable
        } catch (err) {
            console.log(err, `-----> err  in getOne function   at extratimetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get extratimetable', `${err.message}`)
        }
    }

    async getAll(provider_id) {
        try {
            console.log(provider_id)
            const sql = `SELECT id AS extradate_id,  date, start_time, end_time
            FROM extratimetables
            WHERE provider_id = ${provider_id};`
            console.log(sql)
            const all_extratimetable = await db.query(sql)
            return all_extratimetable
        } catch (err) {
            console.log(err, `-----> err  in getAll function   at extratimetable_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get all extratimetable', `${err.message}`)
        }
    }
}

const extratimetablemodel = new ExtratimetableModel();
export { extratimetablemodel };
