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

class ServiceFormCheck {    

    forCreateUpdateGetAll (req, res, next) {

                // проверка на количество параметров

        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require) { 

            const param = 'service_name'
            const data = i18n.__('validation.isMatch', ` ${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the service_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('service_name')) {  
            console.log(req.body.service_name, "service_name")
            return next()
        }else{   
            const param = 'service_name'
            const data = i18n.__('validation.isProvided', 'service_name' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the service_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }

    forActivate (req, res, next) {

                // проверка на количество параметров
                
        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    
        const param = 'active'

        if (count_properties < count_require || count_properties > count_require) {      
            const data = i18n.__('validation.isMatch', `${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)  
            console.log(bad_request_error, ` ---> bad_request_error in forActivate function at the service_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                 // проверка на налиние параметров

        if (req.body.hasOwnProperty('active')) { 
            console.log(req.body.active, " -----> active")
            return next()
        }else{   
            const data = i18n.__('validation.isProvided', 'active' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the service_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }
}

const serviceFormCheck = new ServiceFormCheck();
export {serviceFormCheck}
