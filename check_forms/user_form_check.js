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

class UserFormCheck { 
    
    forCreateUpdate (req, res, next) {

        // проверка на количество параметров

        const count_require = 6
        const count_total = 8
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_total) { 

            const param = 'user create form'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('email')) {  
            console.log(req.body.email, "email")
        }else{   
            const param = 'email'
            const data = i18n.__('validation.isProvided', 'email' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('phone')) {  
            console.log(req.body.phone, "phone")
        }else{   
            const param = 'phone'
            const data = i18n.__('validation.isProvided', 'phone' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('first_name')) {  
            console.log(req.body.first_name, "first_name")
        }else{   
            const param = 'first_name'
            const data = i18n.__('validation.isProvided', 'first_name' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('last_name')) {  
            console.log(req.body.last_name, "last_name")
            next()
        }else{   
            const param = 'email'
            const data = i18n.__('validation.isProvided', 'last_name' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }

        // if (req.body.hasOwnProperty('password')) {  
        //     console.log(req.body.password, "password")
        // }else{   
        //     const param = 'password'
        //     const data = i18n.__('validation.isProvided', 'password' )
        //     const bad_request_error = new Api400Error(param, data)
        //     console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
        //     return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        // }

        // if (req.body.hasOwnProperty('service')) {  
        //     console.log(req.body.service, "serviceservice")
        // }else{   
        //     const param = 'service'
        //     const data = i18n.__('validation.isProvided', 'service' )
        //     const bad_request_error = new Api400Error(param, data)
        //     console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
        //     return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        // }
        // profile_id Не приходит в форме при создании

        // if (req.body.hasOwnProperty('profile_id')) {  
        //     console.log(req.body.profile_id, "profile_idprofile_id")
        // }else{   
        //     const param = 'profile_id'
        //     const data = i18n.__('validation.isProvided', 'profile_id' )
        //     const bad_request_error = new Api400Error(param, data)
        //     console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the user_form_check.js`)    
        //     return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        // }
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
            console.log(req.body.active, "active")
            next()
        }else{   
            const param = 'userthread_id'
            const data = i18n.__('validation.isProvided', 'active')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the user_form_check.js`)    
            return res.status(bad_request_error.error.code || 400).json(bad_request_error) 
        }
    }
}

const userFormCheck = new UserFormCheck();
export {userFormCheck}