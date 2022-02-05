import { bookingmodel } from '../models/booking_model.js';
import { equipmentprovidermodel } from '../models/equipmentprovider_model.js';

import { validationResult } from 'express-validator';
import  i18n   from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import Api500Error from '../errors/api500_error.js';
import httpStatusCodes from'../enums/http_status_codes_enums.js';

class BookingControlller{
    validationSchema = {

        bookingId: {

            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: bookingId => {
                    return bookingId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'bookingId')},       
                bail: true,             
            },
            custom: {
                options:  (bookingId, { req, location, path}) => {   
                    if(req.method === 'GET'){
                        return true
                    }else{        
                        return bookingmodel.isExist(bookingId).then( is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows booking from validationSchema')
        
                            if ( is_exist.rows[0].exists !== true) {
                                console.log('Booking with booking_id = ${bookingId} is not in DB (from booking_controller.js)')
                                return Promise.reject('404 ' + i18n.__('validation.isExist', `booking_id = ${bookingId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }  // если exists == true, то валидация прошла, если нет то ловим 404
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code" : err.statusCode,
                                        "message" : err.error.message,
                                        },
                                    "data": err.data,
                                    }
                                console.log(server_error, " ------------------> Server Error in validationSchema at booking_conrtoller.js")
                                return Promise.reject(server_error)
                            }else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
        },
        equipmentprovider_id: {

            in: ['body'],
            isInt: {
                if: value => {
                    return value !== undefined;
                  },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipmentprovider_id')},
                bail: true,
            }, 
            custom: {
                options:  (equipmentprovider_id, { req, location, path}) => {   
                    if(req.method === 'GET'){
                        return true
                    }else{        
                        return equipmentprovidermodel.isExist(equipmentprovider_id).then( is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows booking from validationSchema')
        
                            if ( is_exist.rows[0].exists !== true) {
                                console.log('Booking with equipmentprovider_id = ${equipmentprovider_id} is not in DB (from booking_controller.js)')
                                return Promise.reject('404 ' + i18n.__('validation.isExist', `equipmentprovider_id = ${equipmentprovider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }  // если exists == true, то валидация прошла, если нет то ловим 404
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code" : err.statusCode,
                                        "message" : err.error.message,
                                        },
                                    "data": {
                                        "equipmentprovider_id" : err.data,
                                    }
                                    }
                                console.log(server_error, " ------------------> Server Error in validationSchema at booking_conrtoller.js")
                                return Promise.reject(server_error)
                            }else {
                                const msg = err //  Здесь будет пойманная 404
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
        },
        activity_start: {
            in: ['body'],
            optional: true,
            isISO8601: {  //isISO8601  требует представление даты и времени  или одной даты
                // strict: true, 
                // strictSeparator: true ,
                errorMessage: () => { return i18n.__('validation.isISO8601', 'activity_start')},
                bail: true,
            },
            trim: true,
            escape: true,
        },
        activity_end: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'activity_end')},
                bail: true,
            },
            trim: true,
            escape: true,
        },
        time_unit: {  // в БД это (var char 5) day / hour
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'time_unit')},
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'time_unit')},
                options: {min:3, max:4 },
                bail: true,
            },
            isIn: {
                errorMessage: () => { return i18n.__('validation.isIn', 'service') },
                options: [['hour', 'day']],
                bail: true,
            },
            trim: true,
            escape: true,
        },
        fare: {
            in: ['body'],
            optional: true,
            isInt: {
                options: {
                    min: 0,
                    max: 1000000
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'fare')},
                bail: true,
            },
        },
        fare_sum: {
            in: ['body'],
            optional: true,
            isInt: { 
                options: {
                    min: 0,
                    max: 1000000
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'fare_sum')},       
                bail: true,             
            },
        },
      }

    checkResult(req, res, next)  {
        console.log(" ----> checkResult" ) 
        // console.log(i18n.getLocale(),'------> locale')

        const validation_result = validationResult(req)
        const hasError = !validation_result.isEmpty();
        console.log(hasError, " ----> hasError", validation_result.array(), " ----> validation_result", ) 
        if (hasError) {
            const data = validation_result.errors[0].msg

            if(typeof(data) !== 'object') {
                if (data.startsWith('404')){
                    const param = validation_result.errors[0].param
                    const not_found_error = new Api404Error(param, data)
                    console.log(not_found_error,  ` ----> not_found_error from the BookingController.checkResult`) 
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                }else{
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)        
                    console.log(bad_request_error,  ` ----> bad_request_error from the BookingController.checkResult`) 
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
                }              
            }else{
                const server_error = data
                console.log(server_error,  ` ----> server_error from the BookingController.checkResult`) 
                res.status(server_error.statusCode || 500).json(server_error) 
            }
        }else{
            return next()
        }              
    }
   
    //  ### Создать бронирование ###
    async createBooking(req, res) { 
        try{    
            const {equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum} = req.body
            const new_booking = await bookingmodel.ceate(equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum)
            if (new_booking.rows[0].id) {
                const result = { 
                    success: true,
                    data: " Booking successfully created"
                }
                console.log(new_booking.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error( 'equipmentprovider_id', 'Unhandled Error')
                console.log(result, ' ----> err from createBooking function at booking_controller.js')
                res.status(result.statusCode || 500).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in createBooking function at booking_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Обновить бронирование ###
    async updateBooking(req, res) { 
        try{    
            // console.log(req.params.id)
            const {equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum} = req.body
            const booking_id = req.params.bookingId
            console.log(booking_id, "Test updateBooking")

            const updated_booking = await bookingmodel.update(booking_id, equipmentprovider_id, activity_start, activity_end, time_unit, fare, fare_sum)
            if (updated_booking.rows) {
                const result = { 
                    success: true,
                    data: " Booking successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updated_booking.rows, result )
            } else {
                const result = new Api404Error( 'booking_id', i18n.__('validation.isExist', `booking_id = ${booking_id}`)) 
                console.log(result, ' ----> err from updateBooking function at booking_controller.js')
                res.status(result.statusCode || 500).json(result) 
            }
        }catch(err) {
            console.error({err},  '-----> err in updateBooking function at booking_controller.js ')
            res.status(err.statusCode || 500).json(err) 
        }
    }

     //  ### Подтвердить бронирование ###
    async approveBooking (req, res) {
        try{    
            // console.log(req.params.id)
            const booking_id = req.params.bookingId
            const activated_booking = await bookingmodel.approve(booking_id)
            if (activated_booking.rows[0]) {
                const result = { 
                    success: true,
                    data: " Booking successfully approved"
                }
                console.log(activated_booking.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }else{                
                const result = new Api404Error( 'booking_id', i18n.__('validation.isExist', `booking_id  ${booking_id}`)) 
                console.log(result, ` ----> err in approveBooking function with booking_id ${booking_id} not exists at booking_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } 
        } catch(err) {
            console.error({err},  '-----> err in approveBooking function at booking_controller.js ')           
            res.status(err.statusCode || 500).json(err)    
        } 
    }

    //  ### Отменить бронирование ###
    async cancelBooking (req, res) {
        try{    
            // console.log(req.params.id)
            const booking_id = req.params.bookingId
            const activated_booking = await bookingmodel.cancel(booking_id)
            if (activated_booking.rows[0]) {
                const result = { 
                    success: true,
                    data: " Booking successfully canceled"
                }
                console.log(activated_booking.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }else{                
                const result = new Api404Error( 'booking_id', i18n.__('validation.isExist', `booking_id  ${booking_id}`)) 
                console.log(result, ` ----> err in cancelBooking function with booking_id ${booking_id} not exists at booking_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } 
        } catch(err) {
            console.error({err},  '-----> err in cancelBooking function at booking_controller.js ')           
            res.status(err.statusCode || 500).json(err)    
        } 
    }
     //  ### Удалить бронирование ###
     async deleteBooking(req, res) { 
        try{    
            console.log(req.params.id)
            const booking_id = req.params.bookingId
            console.log(booking_id, "Test deleteBooking")
            const deleted_booking = await bookingmodel.delete(booking_id)
            if (deleted_booking.rows[0]) {
                const result = { 
                    success: true,
                    data: " Booking successfully deleted"
                }
                console.log(deleted_booking.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_booking.rows.length == 0) {
                const result = new Api404Error( 'booking_id', i18n.__('validation.isExist', `booking_id = ${booking_id}`)) 
                console.log(result, ' ----> err in deleteBooking function with booking_id = ${booking_id} not exists at booking_controller.js;')
                res.status(result.statusCode || 500).json(result) 
            }
        } catch(err) {
            console.error({err},  '----> err in deleteBooking function at booking_controller.js ')
            res.status(err.statusCode || 500).json(err)            
        }
    }    

     //  ### Получить одно бронирование ###
     async getOneBooking(req, res) { 
        try{    
            const booking_id = req.params.bookingId
            console.log(booking_id, "Test getBooking")
            const one_booking = await bookingmodel.getOne(booking_id)
            if (one_booking.rows[0]) {
                const result = {
                    "success": true,
                    "data": one_booking.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)            
            } else {
                const result = new Api404Error( 'booking_id', i18n.__('validation.isExist', `booking_id = ${booking_id}`)) 
                console.log(result, ` -----> err in getBooking function with booking_id = ${booking_id} not exists at booking_controller.js;`)
                res.status(result.statusCode || 500).json(result) 
            }
        }catch(err) {
            console.error({err},  '---->err in getBooking function at booking_controller.js ')
            res.status(err.statusCode || 500).json(err)            
        }
     }    

     //  ### Получить все бронирование ###
     async getAllBookings(req, res) { 

        const {equipmentprovider_id} = req.body
        console.log(equipmentprovider_id, "Test getBookings")

        const all_bookings = await bookingmodel.getAll(equipmentprovider_id)
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