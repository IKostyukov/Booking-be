import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class FareModel {

    //  ###  Тарификация (fares)  ###

    async isExist(fare_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM fares WHERE id = ${fare_id}) AS "exists";`
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with fare_id = ${fare_id}  at  fare_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('fare_id', `${err.message}`)
        }
    }

    async isUniqueCombinationForCreate(equipment_id, duration, time_unit) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM fares WHERE equipmentprovider_id = ${equipment_id} AND duration = '${duration}'
        AND time_unit = '${time_unit}') AS "exists";`
        try {
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isExist function with equipment_id = ${equipment_id}  in fares_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async isUniqueCombinationForUpdate(fare_id, equipment_id, duration, time_unit) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM fares WHERE id != ${fare_id}  AND equipmentprovider_id = ${equipment_id} AND duration = '${duration}'
        AND time_unit = '${time_unit}') AS "exists";`
        try {
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isExist function with equipment_id = ${equipment_id}  in fares_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('equipment_id', `${err.message}`)
        }
    }

    async createNewFare(equipmentprovider_id, duration, time_unit, fare, discountnonrefundable) {
        try {
            console.log(equipmentprovider_id, fare)
            const new_fare = await db.query(`INSERT INTO fares(
                equipmentprovider_id, duration, time_unit, fare, discountnonrefundable, ctime)
                VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *;`, [equipmentprovider_id, duration, time_unit, fare, discountnonrefundable])

            // console.log(new_fare.rows, `-----> new_fare.rows in createNewFare function with equipmentprovider_id = ${equipmentprovider_id}  at fares_model.js`)
            return new_fare
        } catch (err) {
            console.log(err, `-----> err in createNewFare function with equipmentprovider_id = ${equipmentprovider_id}  at fares_model.js`)
            throw new Api500Error('create new fare', `${err.message}`)
        }
    }

    async updateNewFare(fare_id, equipmentprovider_id, duration, time_unit, fare, discountnonrefundable) {
        try {
            console.log(equipmentprovider_id, fare)
            const new_fare = await db.query(`UPDATE fares
            SET  fare=$1,  equipmentprovider_id=$2,  duration=$3, time_unit=$4, discountnonrefundable = $5
            WHERE  id = $6
            RETURNING *;`, [fare, equipmentprovider_id, duration, time_unit, fare_id, discountnonrefundable])
            return new_fare
        } catch (err) {
            console.log(err, `-----> err in updateNewFare function with fare_id = ${fare_id}  at fares_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('update fare', `${err.message}`)
        }
    }

    async deleteOneFare(fare_id) {
        try {
            console.log(fare_id)
            const deleted_fare = await db.query(`DELETE FROM  fares
            WHERE  id = $1
            RETURNING *;`, [fare_id])
            return deleted_fare
        } catch (err) {
            console.log(err, `-----> err in deleteOneFare function with fare_id = ${fare_id}  at fares_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete fare', `${err.message}`)
        }
    }

    async getOneFare(fare_id) {
        try {
            console.log(fare_id)
            const one_fare = await db.query(`SELECT id AS fare_id,
            equipmentprovider_id, duration, time_unit, fare, discountnonrefundable
            FROM fares WHERE id = ${fare_id};`)
            return one_fare
        } catch (err) {
            console.log(err, `-----> err in getOneFare function with fare_id = ${fare_id}  at fares_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get one fare', `${err.message}`)
        }
    }


    async getAllFares(equipmentprovider_id) {
        try {
            console.log(equipmentprovider_id)
            const all_fares = await db.query(`SELECT id AS fare_id,
            equipmentprovider_id, duration, time_unit, fare, discountnonrefundable
            FROM fares WHERE equipmentprovider_id = ${equipmentprovider_id};`)
            return all_fares
        } catch (err) {
            console.log(err, `-----> err in getAllFares function with equipmentprovider_id = ${equipmentprovider_id}  at fares_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get all fares', `${err.message}`)
        }
    }

}

const faremodel = new FareModel();
export { faremodel };
