import i18n from 'i18n';
import Api400Error from '../errors/api400_error.js';


const countProperties = (obj) => {
    let count = 0;
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            ++count;
    }
    return count;
}

class AdvantageproviderFormCheck {

    forAdd(req, res, next) {

         // проверка на количество параметров
         const count_require = 1
         const count_total = 1
         const count_properties = countProperties(req.body)
         console.log(count_properties, "count of properties");
 
         if (count_properties < count_require || count_properties > count_total) {
 
             const param = 'advantage'
             const data = i18n.__('validation.isMatch', ` ${count_total}`, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)
 
             console.log(bad_request_error, ` ------> bad_request_error in forAdd function at the advantageprovider_form_check.js`)
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
         // проверка на налиние параметров
        if (req.body.hasOwnProperty('advantage_id')) {
            console.log(req.body.advantage_id, " advantage_id")
            return next()
        } else {
            const param = 'advantage_id'
            const data = i18n.__('validation.isProvided', ' advantage_id')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forAdd function at the advantageprovider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }
}

const advantageproviderFormCheck = new AdvantageproviderFormCheck();
export { advantageproviderFormCheck }