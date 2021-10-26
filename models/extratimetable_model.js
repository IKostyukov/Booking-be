import { pool } from "../db.js";
const db = pool

class ExtratimetableModel {

      // ### Экстрадаты ###

    async createNewExtratimetable ( recipientofservices_id, date, start_time, end_time) {
        console.log(start_time, end_time) 
        const new_extratimetable = await db.query(`INSERT INTO extratimetables(
            recipientofservices_id, date, start_time, end_time)
            VALUES ($1, $2, $3, $4)
        RETURNING *;`, [recipientofservices_id, date, start_time, end_time])
        return new_extratimetable
    }
    
    async updateNewExtratimetable (extratimetable_id,  recipientofservices_id, date, start_time, end_time,  mtime = 'NOW()') {
        console.log(start_time, end_time) 
        const updsted_extratimetable = await db.query(`UPDATE extratimetables
        SET recipientofservices_id=$1, date=$2, start_time=$3, end_time=$4, mtime=$5
        WHERE id = $6
        RETURNING *;`, [recipientofservices_id, date, start_time, end_time, mtime, extratimetable_id])
        return updsted_extratimetable
    }

    async deleteOneExtratimetable (extratimetable_id) {
        console.log(extratimetable_id) 
        const deleted_extratimetable = await db.query(`DELETE FROM extratimetables
        WHERE id = $1
        RETURNING *;`, [extratimetable_id])
        return deleted_extratimetable
    }
}

const extratimetablemodel = new ExtratimetableModel();
export { extratimetablemodel };
