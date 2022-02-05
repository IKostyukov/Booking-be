import  i18n   from 'i18n';
import Api400Error from '../errors/api400_error.js';


const countProperties = (obj) => {
    let count = 0;    
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }    
    return count;
}

class BookingFormCheck {    

    forCreateUpdate (req, res, next) {

                // проверка на количество параметров

        const count_require = 6
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require + 1) { 

            const param = 'equipmentprovider_id'
            const data = i18n.__('validation.isMatch', ` ${count_require} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('equipmentprovider_id')) {  
            console.log(req.body.equipmentprovider_id, "equipmentprovider_id")
        }else{   
            const param = 'equipmentprovider_id'
            const data = i18n.__('validation.isProvided', 'equipmentprovider_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('activity_start')) {  
            console.log(req.body.activity_start, "activity_start")
        }else{   
            const param = 'activity_start'
            const data = i18n.__('validation.isProvided', 'activity_start' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('activity_end')) {  
            console.log(req.body.activity_end, "activity_end")
        }else{   
            const param = 'activity_end'
            const data = i18n.__('validation.isProvided', 'activity_end' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('time_unit')) {  
            console.log(req.body.time_unit, "time_unit")
        }else{   
            const param = 'time_unit'
            const data = i18n.__('validation.isProvided', 'time_unit' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('fare')) {  
            console.log(req.body.fare, "fare")
        }else{   
            const param = 'fare'
            const data = i18n.__('validation.isProvided', 'fare' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('fare_sum')) {  
            console.log(req.body.fare_sum, "fare_sum")
            return next()
        }else{   
            const param = 'fare_sum'
            const data = i18n.__('validation.isProvided', 'fare_sum' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }
    forGetAll (req, res, next) {

        // проверка на количество параметров

        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require) { 

            const param = 'equipmentprovider_id'
            const data = i18n.__('validation.isMatch', ` ${count_require} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forGetAll function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('equipmentprovider_id')) {  
            console.log(req.body.equipmentprovider_id, "equipmentprovider_id")
            return next()
        }else{   
            const param = 'equipmentprovider_id'
            const data = i18n.__('validation.isProvided', 'equipmentprovider_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forGetAll function at the booking_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }
}

const bookingFormCheck = new BookingFormCheck();
export {bookingFormCheck}
