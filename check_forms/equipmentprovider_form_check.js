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

class EquipmentproviderFormCheck {    

    forCreateUpdate (req, res, next) {

         // проверка на количество параметров

         const count_require = 2
         const count_total = 5
         const count_properties = countProperties(req.body) 
         console.log(count_properties, "count of properties");    
 
         if (count_properties < count_require || count_properties > count_total) { 
 
             const param = 'user create form'
             const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)        
 
             console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the equipmentprovider_form_check.js`)    
             return res.status(bad_request_error.error.code || 400).json(bad_request_error)
         }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('equipment_id')) {  
            console.log(req.body.activity_name, "equipment_id")
        }else{   
            const param = 'equipment_id'
            const data = i18n.__('validation.isProvided', 'equipment_id' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the equipmentprovider_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('quantity')) {  
            console.log(req.body.activity_name, "quantity")
            return next()
        }else{   
            const param = 'quantity'
            const data = i18n.__('validation.isProvided', 'quantity' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the equipmentprovider_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }

    forActivate (req, res, next) {

         // проверка на количество параметров

         const count_require = 1
         const count_total = 1
 
         const count_properties = countProperties(req.body) 
         console.log(count_properties, "count of properties");    
 
         if (count_properties < count_require || count_properties > count_total) { 
 
             const param = 'user activate form'
             const data = i18n.__('validation.isMatch', ` ${count_require}`, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)
             console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the user_form_check.js`)    
             return res.status(bad_request_error.error.code || 400).json(bad_request_error)
         }

                 // проверка на налиние параметров

        if (req.body.hasOwnProperty('active')) { 
            console.log(req.body.active, " -----> active")
            return next()
        }else{   
            const param = 'active'
            const data = i18n.__('validation.isProvided', 'active' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the equipmentprovider_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }
}

const equipmentproviderFormCheck = new EquipmentproviderFormCheck();
export {equipmentproviderFormCheck}
