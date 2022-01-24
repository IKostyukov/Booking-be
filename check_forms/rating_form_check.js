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

    forCreateUpdate (req, res, next) {

                // проверка на количество параметров

        const count_require = 5
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require) { 

            const param = 'rating'
            const data = i18n.__('validation.isMatch', ` ${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('provider_id')) {  
            console.log(req.body.provider_id, "provider_id")
        }else{   
            const param = 'provider_id'
            const data = i18n.__('validation.isProvided', 'provider_id' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        } 

        if (req.body.hasOwnProperty('user_id')) {  
            console.log(req.body.user_id, "user_id")
        }else{   
            const param = 'user_id'
            const data = i18n.__('validation.isProvided', 'user_id' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('clearness')) {  
            console.log(req.body.clearness, "clearness")
        }else{   
            const param = 'clearness'
            const data = i18n.__('validation.isProvided', 'clearness' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('staff')) {  
            console.log(req.body.staff, "staff")
        }else{   
            const param = 'staff'
            const data = i18n.__('validation.isProvided', 'staff' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('view')) {  
            console.log(req.body.view, "view")
            return next()
        }else{   
            const param = 'view'
            const data = i18n.__('validation.isProvided', 'view' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }

    forConnect (req, res, next) {

                // проверка на количество параметров
                
        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    
        const param = 'connect raring with feedback'

        if (count_properties < count_require || count_properties > count_require) {      
            const data = i18n.__('validation.isMatch', `${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)  
            console.log(bad_request_error, ` ---> bad_request_error in forActivate function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                 // проверка на налиние параметров

        if (req.body.hasOwnProperty('message_id')) { 
            console.log(req.body.message_id, " -----> message_id")
            return next()
        }else{   
            const data = i18n.__('validation.isProvided', 'message_id' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forConnect function at the rating_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }
}

const ratingFormCheck = new ServiceFormCheck();
export {ratingFormCheck}
