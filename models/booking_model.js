import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool
// DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}'

class BookingModel {

    async ceate(equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum) {
        try {
            // const roles_id = Array.from(roles.split(','), Number)
            const new_booking = await db.query(`            
            INSERT INTO bookings 
            (equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`, [equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum])

            return new_booking
        } catch (err) {                                       
            console.log(err, `-----> err in create function with equipmentprovider_id = ${equipmentprovider_id}  at booking_model.js`)                                                                  
            throw new Api500Error( 'create bookihg', `${err.message}`)                                                                  
        }
    }

    async update(booking_id, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum) {       
        try {
            const updated_booking = await db.query(`UPDATE bookings
            SET equipmentprovider_id=$2, activity_start=$3, activity_end=$4, time_unit=$5, fare=$6, fare_sum=$7
            WHERE id = $1
            RETURNING *;`, [booking_id, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum])
            console.log(updated_booking.rows) 
            return updated_booking
        }catch(err){                                       
            console.log(err, `-----> err in update function with booking_id = ${booking_id}  at booking_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'booking_id', `${err.message}`)                                                                  
        }
    }
    
    async approve(booking_id) {
        try {
            const activated_booking = await db.query(`UPDATE bookings
            SET approved = true
            WHERE id = $1
            RETURNING *;`, [ booking_id])
            //console.log(activated_booking.rows)
            return activated_booking
        }catch(err) {                                       
            console.log(err, `-----> err in activate function with booking_id = ${booking_id}  at booking_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'booking_id', `${err.message}`)                                                                  
        }
    }

    async cancel(booking_id) {
        try {
            const deactivated_booking = await db.query(`UPDATE bookings
            SET approved = false
            WHERE id = $1
            RETURNING *;`, [ booking_id])
            //console.log(activated_booking.rows)
            return deactivated_booking
        }catch(err) {                                       
            console.log(err, `-----> err in activate function with booking_id = ${booking_id}  at booking_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'booking_id', `${err.message}`)                                                                  
        }
    }


    async deleteOneBooking(booking_id) {
        try {
            const deleted_booking = await db.query(`DELETE FROM bookings 
            WHERE id = $1 RETURNING *;`, [ booking_id])
            return deleted_booking
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with booking_id = ${booking_id}  at booking_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'booking_id', `${err.message}`)                                                                 
        }
    }

    async findOne(booking_id) {
        try {
            const get_booking = await db.query(`SELECT id AS booking_id, approved, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum
            FROM bookings WHERE bookings.id = ${booking_id};`)
            console.log(get_booking.rows)        
            return get_booking
        } catch (err) {                                       
            console.log(err, `-----> err  in findOne function with booking_id = ${booking_id}  at booking_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'booking_id', `${err.message}`)                                                                  
        }  
    }

    async findAll({ state, sortBy, limit, offset, s }) {
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

            let sql_query = `SELECT id AS booking_id, approved, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum 
                            FROM bookings `
            let condition = ''

            const where = `WHERE `
            const state_condition = `approved = 'true' `
            const search_condition = `equipmentprovider_id = ${s}`
            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(id) AS count FROM bookings '
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

            console.log(sql_query, `-----> sql_query  in findAll function with ${s}  at booking_model.js`)

            const all_activitirs = await db.query(sql_query)
            return all_activitirs



            // const get_bookings = await db.query(`SELECT id AS booking_id, approved, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum
            // FROM bookings WHERE equipmentprovider_id = ${equipmentprovider_id};`)       
            // // console.log(get_bookings.rows)
            // return get_bookings
        } catch (err) {                                       
            console.log(err, `-----> err  in findAll function with equipmentprovider_id = ${equipmentprovider_id}  at booking_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipmentprovider_id', `${err.message}`)                                                                  
        } 
    }
    async isExist(booking_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE id = ${booking_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with booking_id = ${booking_id}  at  booking_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'booking_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(equipmentprovider_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE equipmentprovider_id = '${equipmentprovider_id}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with equipmentprovider_id = ${equipmentprovider_id}  in booking_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipmentprovider_id', `${err.message}`)                                                                
        }
    }
}

    



const bookingmodel = new BookingModel();
export { bookingmodel };