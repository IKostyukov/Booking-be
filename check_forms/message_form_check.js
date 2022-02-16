import  i18n   from 'i18n';
import Api400Error from '../errors/api400_error.js';
import { countProperties, checkQueryProperties } from './_form_check_methods.js';

class MessageFormCheck {    

    forCreateUpdate (req, res, next) {

                // проверка на количество параметров

        const count_require = 4
        const count_total = 8
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_total) { 

            const param = 'message create form'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)        

            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('user_id')) {  
            console.log(req.body.user_id, "user_id")
        }else{   
            const param = 'user_id'
            const data = i18n.__('validation.isProvided', 'user_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('messagethread_id')) {  
            console.log(req.body.messagethread_id, "messagethread_id")
        }else{   
            const param = 'messagethread_id'
            const data = i18n.__('validation.isProvided', 'messagethread_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('content')) {  
            console.log(req.body.content, "content")
        }else{   
            const param = 'content'
            const data = i18n.__('validation.isProvided', 'content' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }

        if (req.body.hasOwnProperty('reminder_frequency_id')) {  
            console.log(req.body.reminder_frequency_id, "reminder_frequency_id")
            next()
        }else{   
            const param = 'reminder_frequency_id'
            const data = i18n.__('validation.isProvided', 'reminder_frequency_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the message_form_check.js`)    
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

            const param = 'message activate form'
            const data = i18n.__('validation.isMatch', ` ${count_require}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('is_reminder')) {  
            console.log(req.body.is_reminder, "is_reminder")
            return next()
        }else{   
            const param = 'is_reminder'
            const data = i18n.__('validation.isProvided', 'is_reminder' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the message_form_check.js`)    
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
             const param = 'retrieve messages'
             const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total} `, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)
             console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the message_form_check.js`)
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
         // проверка на налиние параметров            
         const expected_array = ['state', 'sortBy', 'size', 'page', 's']
         const check_properties = checkQueryProperties(req.query, expected_array)
         // console.log(check_properties)
 
         if (check_properties !== true) {
             const param = 'retrieve messages'
             const data = i18n.__('validation.isExpected', `${check_properties}`)
             const bad_request_error = new Api400Error(param, data)
             console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the message_form_check.js`)
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
 
         const expected_array_of_sortBy = ['field', 'direction']
         for (let i = 0; i < req.query.sortBy.length; i++) {
             const check_properties_of_sortBy = checkQueryProperties(req.query.sortBy[i], expected_array_of_sortBy)
             if (check_properties_of_sortBy !== true) {
                 const param = 'retrieve activites'
                 const data = i18n.__('validation.isExpected', `${check_properties_of_sortBy}`)
                 const bad_request_error = new Api400Error(param, data)
                 console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the message_form_check.js`)
                 return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
             } else {
                return next()
             }
         }
    }
}

const messageFormCheck = new MessageFormCheck();
export {messageFormCheck}