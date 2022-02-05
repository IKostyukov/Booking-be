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

class ProviderFormCheck {    

    forCreate (req, res, next) {

         // проверка на количество параметров

         const count_require = 11
         const count_total = 11
         const count_properties = countProperties(req.body) 
         console.log(count_properties, "count of properties");    
 
         if (count_properties < count_require || count_properties > count_total) { 
 
             const param = 'user_id create form'
             const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)        
 
             console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('provider_name')) {  
            console.log(req.body.provider_name, "provider_name")
        }else{   
            const param = 'provider_name'
            const data = i18n.__('validation.isProvided', 'provider_name' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('providertype_id')) {  
            console.log(req.body.providertype_id, "providertype_id")
        }else{   
            const param = 'providertype_id'
            const data = i18n.__('validation.isProvided', 'providertype_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.providertype_id == 1) {
            if (req.body.hasOwnProperty('recreationfacilitytype_id')) {  
                console.log(req.body.recreationfacilitytype_id, "recreationfacilitytype_id")
            }else{   
                const param = 'recreationfacilitytype_id'
                const data = i18n.__('validation.isProvided', 'recreationfacilitytype_id' )
                const bad_request_error = new Api400Error(param, data)
                console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
                return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
            }
        }

        if (req.body.hasOwnProperty('user_id')) {  
            console.log(req.body.user_id, "user_id")
        }else{   
            const param = 'user_id'
            const data = i18n.__('validation.isProvided', 'user_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('geolocation')) {  
            console.log(req.body.geolocation, "geolocation")
        }else{   
            const param = 'geolocation'
            const data = i18n.__('validation.isProvided', 'geolocation' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('location')) {  
            console.log(req.body.location, "location")
        }else{   
            const param = 'location'
            const data = i18n.__('validation.isProvided', 'location' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('address')) {  
            console.log(req.body.address, "address")
        }else{   
            const param = 'address'
            const data = i18n.__('validation.isProvided', 'address' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('post_index')) {  
            console.log(req.body.post_index, "post_index")
        }else{   
            const param = 'post_index'
            const data = i18n.__('validation.isProvided', 'post_index' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('equipments')) {  
            console.log(req.body.equipments, "equipments")
        }else{   
            const param = 'equipments'
            const data = i18n.__('validation.isProvided', 'equipments' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('description')) {  
            console.log(req.body.description, "description")
        }else{   
            const param = 'description'
            const data = i18n.__('validation.isProvided', 'description' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty(' timetable')) {  
            console.log(req.body. timetable, " timetable")
        }else{   
            const param = ' timetable'
            const data = i18n.__('validation.isProvided', ' timetable' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty(' services')) {  
            console.log(req.body. services, " services")
           return next()
        }else{   
            const param = ' services'
            const data = i18n.__('validation.isProvided', ' services' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('provider')) {  
            console.log(req.body.provider, "provider")
        }else{   
            const param = 'provider'
            const data = i18n.__('validation.isProvided', 'provider' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

    }
}

const providerFormCheck = new ProviderFormCheck();
export {providerFormCheck}
