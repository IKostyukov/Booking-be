import  i18n   from 'i18n';
import Api400Error from '../errors/api400_error.js';
import { countProperties, checkQueryProperties } from './_form_check_methods.js';


class EquipmentproviderFormCheck {    

    forCreateUpdate (req, res, next) {

         // проверка на количество параметров

         const count_require = 2
         const count_total = 5
         const count_properties = countProperties(req.body) 
         console.log(count_properties, "count of properties");    
 
         if (count_properties < count_require || count_properties > count_total) { 
 
             const param = 'equipment create form'
             const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)        
 
             console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the equipmentprovider_form_check.js`)    
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('equipment_id')) {  
            console.log(req.body.activity_name, "equipment_id")
        }else{   
            const param = 'equipment_id'
            const data = i18n.__('validation.isProvided', 'equipment_id' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the equipmentprovider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('quantity')) {  
            console.log(req.body.activity_name, "quantity")
            return next()
        }else{   
            const param = 'quantity'
            const data = i18n.__('validation.isProvided', 'quantity' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the equipmentprovider_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }

    forActivate (req, res, next) {

         // проверка на количество параметров

         const count_require = 1
         const count_total = 1
 
         const count_properties = countProperties(req.body) 
         console.log(count_properties, "count of properties");    
 
         if (count_properties < count_require || count_properties > count_total) { 
 
             const param = 'equipment activate form'
             const data = i18n.__('validation.isMatch', ` ${count_require}`, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)
             console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the equipment_form_check.js`)    
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
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
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }

    forRetrieve(req, res, next) {

        // проверка на количество параметров
        const count_require = 0
        const count_total = 4
        const count_properties = countProperties(req.query)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {
            const param = 'retrieve equipments'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the equipmentprovider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров            
        const expected_array = ['state', 'sortBy', 'size', 'page']
        const check_properties = checkQueryProperties(req.query, expected_array)
        // console.log(check_properties)
        if (check_properties !== true) {
            const param = 'retrieve equipments'
            const data = i18n.__('validation.isExpected', `${check_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the equipmentprovider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.query.sortBy) {
            const expected_array_of_sortBy = ['field', 'direction']
            for (let i = 0; i < req.query.sortBy.length; i++) {
                const check_properties_of_sortBy = checkQueryProperties(req.query.sortBy[i], expected_array_of_sortBy)
                if (check_properties_of_sortBy !== true) {
                    const param = 'retrieve equipments'
                    const data = i18n.__('validation.isExpected', `${check_properties_of_sortBy}`)
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the equipmentprovider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                } else {
                    return next()
                }
            }
        }
        return next()
    }
}

const equipmentproviderFormCheck = new EquipmentproviderFormCheck();
export {equipmentproviderFormCheck}
