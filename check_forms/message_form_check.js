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

    getMessages (req, res, next) {

        // проверка на количество параметров

        const count_require = 1
        const count_total = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_total) { 

            const param = 'get message form'
            const data = i18n.__('validation.isMatch', ` ${count_require} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in getMessages function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('messagethread_id')) {  
            console.log(req.body.messagethread_id, "messagethread_id")
            return next()
        }else{   
            const param = ' messagethread_id'
            const data = i18n.__('validation.isProvided', 'messagethread_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in getMessages function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }

    getThreads (req, res, next) {

        // проверка на количество параметров

        const count_require = 1
        const count_total = 1
        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties < count_require || count_properties > count_total) { 

            const param = 'get threads form'
            const data = i18n.__('validation.isMatch', ` ${count_require} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in getThreads function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
                // проверка на налиние параметров

        if (req.body.hasOwnProperty('user_id')) {  
            console.log(req.body.user_id, "user_id")
            return next()
        }else{   
            const param = 'user_id'
            const data = i18n.__('validation.isProvided', 'user_id' )
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in getThreads function at the message_form_check.js`)    
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error) 
        }
    }
}

const messageFormCheck = new MessageFormCheck();
export {messageFormCheck}