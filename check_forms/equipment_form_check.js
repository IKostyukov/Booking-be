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

class EquipmentFormCheck {    

    forCreateUpdateGetAll (req, res, next) {

                // проверка на количество параметров

        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require + 1) { 

            const param = 'equipment_name'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_require + 1}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the equipment_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('equipment_name')) {  
            console.log(req.body.equipment_name, "equipment_name")
            return next()
        }else{   
            const param = 'equipment_name'
            const data = i18n.__('validation.isProvided', 'equipment_name' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the equipment_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }

    forActivate (req, res, next) {

                // проверка на количество параметров
                
        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require) {             
            const param = 'is_active'
            const data = i18n.__('validation.isMatch', `${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)  
            console.log(bad_request_error, ` ---> bad_request_error in forActivate function at the equipment_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                 // проверка на налиние параметров

        if (req.body.hasOwnProperty('is_active')) { 
            console.log(req.body.active, " -----> is_active")
            return next()
        }else{   
            const param = 'is_active'
            const data = i18n.__('validation.isProvided', 'is_active' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the equipment_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }
}

const equipmentFormCheck = new EquipmentFormCheck();
export {equipmentFormCheck}
