import  i18n   from 'i18n';
import Api400Error from '../errors/api400_error.js';
import {countProperties, checkQueryProperties} from './_form_check_methods.js';




class AdvantageFormCheck {    

    forCreateUpdate (req, res, next) {

                // проверка на количество параметров

        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_require + 1) { 

            const param = 'advantage_name'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_require + 1}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the advantage_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('advantage_name')) {  
            console.log(req.body.advantage_name, "advantage_name")
            return next()
        }else{   
            const param = 'advantage_name'
            const data = i18n.__('validation.isProvided', 'advantage_name' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdateGetAll function at the advantage_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
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
            console.log(bad_request_error, ` ---> bad_request_error in forActivate function at the advantage_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                 // проверка на налиние параметров

        if (req.body.hasOwnProperty('is_active')) { 
            console.log(req.body.active, " -----> is_active")
            return next()
        }else{   
            const param = 'is_active'
            const data = i18n.__('validation.isProvided', 'is_active' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the advantage_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }

    forRetrieve (req, res, next) {

        // проверка на количество параметров
        const count_require = 0
        const count_total = 5
        const count_properties = countProperties(req.query) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_total) {
            const param = 'retrieve advantages'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the advantage_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

                // проверка на налиние параметров            
        const expected_array = ['state', 'sortBy', 'size', 'page', 's']
        const check_properties = checkQueryProperties (req.query, expected_array )
        console.log(check_properties)
        if (check_properties !== true ) {
                const param = 'retrieve advantages'
                const data = i18n.__('validation.isExpected', `${check_properties}` )
                const bad_request_error = new Api400Error(param, data)
                console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the advantage_form_check.js`)    
                return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }   

        const expected_array_of_sortBy = ['field', 'direction']
        for (let i = 0; i < req.query.sortBy.length; i++) {
            const check_properties_of_sortBy = checkQueryProperties(req.query.sortBy[i], expected_array_of_sortBy)
            if (check_properties_of_sortBy !== true) {
                const param = 'retrieve activites'
                const data = i18n.__('validation.isExpected', `${check_properties_of_sortBy}`)
                const bad_request_error = new Api400Error(param, data)
                console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the advantage_form_check.js`)
                return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
            } else {
                return next()
            }
        }   
    }
}

const advantageFormCheck = new AdvantageFormCheck();
export {advantageFormCheck}
