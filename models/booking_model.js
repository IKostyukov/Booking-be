import { pool } from '../db.js';
const db = pool

class BookingModel {
// DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}'
    async ceateNewBooking(equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum) {
        
        // const roles_id = Array.from(roles.split(','), Number)
        const new_booking = await db.query(`
        
        
        INSERT INTO bookings 
        (equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`, [equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum])

        return new_booking
    }

    async updateOneBooking(booking_id, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum) {       
        const updated_booking = await db.query(`UPDATE bookings
        SET equipmentprovider_id=$2, activity_start=$3, activity_end=$4, time_unit=$5, fare=$6, fare_sum=$7
        WHERE id = $1
        RETURNING *;`, [booking_id, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum])
        console.log(updated_booking.rows) 
        return updated_booking
    }
    
    async approveOneBooking(booking_id) {
        const activated_booking = await db.query(`UPDATE bookings
        SET approved = true
        WHERE id = $1
        RETURNING *;`, [ booking_id])
        //console.log(activated_booking.rows)
        return activated_booking
    }

    async cancelOneBooking(booking_id) {
        const deactivated_booking = await db.query(`UPDATE bookings
        SET approved = false
        WHERE id = $1
        RETURNING *;`, [ booking_id])
        //console.log(activated_booking.rows)
        return deactivated_booking
    }


    async deleteOneBooking(booking_id) {
        const deleted_booking = await db.query(`DELETE FROM bookings 
        WHERE id = $1 RETURNING *;`, [ booking_id])
        return deleted_booking
    }

    async getOneBooking(booking_id) {
        const get_booking = await db.query(`SELECT id AS booking_id, approved, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum
        FROM bookings WHERE bookings.id = ${booking_id};`)
        console.log(get_booking.rows)        
       return get_booking
    }

    async getAllBookings(equipmentprovider_id) {
        const get_bookings = await db.query(`SELECT id AS booking_id, approved, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum
        FROM bookings WHERE equipmentprovider_id = ${equipmentprovider_id};`)       
        // console.log(get_bookings.rows)
        return get_bookings
    }

    

}

const bookingmodel = new BookingModel();
export { bookingmodel };