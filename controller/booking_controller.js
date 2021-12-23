import { bookingmodel } from '../models/booking_model.js';


class BookingControlller{
   
    //  ### Создать бронирование ###
    async createBooking(req, res) { 
        const {equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum} = req.body
        const new_booking = await bookingmodel.ceateNewBooking(equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum)
        if (new_booking.rows[0].id) {
            const result = { success: "true" }
            res.json(result)
            console.log(new_booking.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    //  ### Обновить бронирование ###
    async updateBooking(req, res) { 
        // console.log(req.params.id)
        const {equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum} = req.body
        const booking_id = req.params.bookingId
        console.log(booking_id, "Test updateBooking")

        const new_booking = await bookingmodel.updateOneBooking(booking_id, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum)
        if (new_booking.rows) {
            const result = { success: "true" }
            res.json(result)
            console.log(result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

     //  ### Подтвердить бронирование ###
    async approveBooking (req, res) {
        // console.log(req.params.id)
        const booking_id = req.params.bookingId
        const activated_booking = await bookingmodel.approveOneBooking(booking_id)
        if (activated_booking.rows[0]) {
            const result = { success: "Booking successfully approved" }
            res.json(result)
            console.log(activated_booking.rows[0], result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }

    //  ### Отменить бронирование ###
    async cancelBooking (req, res) {
        // console.log(req.params.id)
        const booking_id = req.params.bookingId
        const activated_booking = await bookingmodel.cancelOneBooking(booking_id)
        if (activated_booking.rows[0]) {
            const result = { success: "Booking successfully canceled " }
            res.json(result)
            console.log(activated_booking.rows[0], result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }
     //  ### Удалить бронирование ###
     async deleteBooking(req, res) { 
        console.log(req.params.id)
        const booking_id = req.params.bookingId
        console.log(booking_id, "Test deleteBooking")

        const deleted_booking = await bookingmodel.deleteOneBooking(booking_id)
        if (deleted_booking.rows[0]) {
            const result = { success: "true" }
            res.json(result)
            console.log(deleted_booking.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

     //  ### Получить одно бронирование ###
     async getBooking(req, res) { 
        const booking_id = req.params.bookingId
        console.log(booking_id, "Test getBooking")
        const one_booking = await bookingmodel.getOneBooking(booking_id)
        if (one_booking.rows[0]) {
            const result = one_booking.rows[0]
            res.json(result)
            console.log(one_booking.rows)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

     //  ### Получить все бронирование ###
     async getBookings(req, res) { 

        const {equipmentprovider_id} = req.body
        console.log(equipmentprovider_id, "Test getBookings")

        const all_bookings = await bookingmodel.getAllBookings(equipmentprovider_id)
        if (all_bookings.rows[0]) {
            const result = all_bookings.rows
            res.json(result)
            console.log(all_bookings.rows)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

}

const booking_controller = new BookingControlller();
export { booking_controller };