
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

class ActivityFormCheck {    

    isName (req, res, next) {

                // проверка на количество параметров

        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties !== count_require) { 

            const param = 'activity_name'
            const data = i18n.__('validation.isMatch', `${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in isName function at the activity_form_check.js`)    
            return res.status(400).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('activity_name')) {  
            console.log(req.body.activity_name, "activity_name")
            return next()
        }else{   
            const param = 'activity_name'
            const data = i18n.__('validation.isProvided', 'activity_name' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in isName function at the activity_form_check.js`)    
            return res.status(400).json(bad_request_error) 
        }
    }

    isActive (req, res, next) {

                // проверка на количество параметров
                
        const count_require = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties !== count_require) {             
            const param = 'active'
            const data = i18n.__('validation.isMatch', `${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)  
            console.log(bad_request_error, ` ---> bad_request_error in isActive function at the activity_form_check.js`)    
            return res.status(400).json(bad_request_error)
        }
                 // проверка на налиние параметров

        if (req.body.hasOwnProperty('active')) { 
            console.log(req.body.active, " -----> active")
            return next()
        }else{   
            const param = 'active'
            const data = i18n.__('validation.isProvided', 'active' )
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in isActive function at the activity_form_check.js`)    
            return res.status(400).json(bad_request_error) 
        }
    }
}

const activityFormCheck = new ActivityFormCheck();
export {activityFormCheck}
