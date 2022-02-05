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

class FareFormCheck {    

    forCreateUpdate (req, res, next) {

         // проверка на количество параметров

         const count_require = 3
         const count_total = 4
         const count_properties = countProperties(req.body) 
         console.log(count_properties, "count of properties");    
 
         if (count_properties < count_require || count_properties > count_total) { 
 
             const param = 'fare create form'
             const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)        
 
             console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the fare_form_check.js`)    
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('duration')) {  
            console.log(req.body.duration, "duration")
        }else{   
            const param = 'duration'
            const data = i18n.__('validation.isProvided', 'duration' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the fare_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('time_unit')) {  
            console.log(req.body.time_unit, "time_unit")
        }else{   
            const param = 'time_unit'
            const data = i18n.__('validation.isProvided', 'time_unit' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the fare_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('fare')) {  
            console.log(req.body.fare, "fare")
            return next()
        }else{   
            const param = 'fare'
            const data = i18n.__('validation.isProvided', 'fare' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the fare_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }
}

const fareFormCheck = new FareFormCheck();
export {fareFormCheck}
