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

class ServiceproviderFormCheck {

    forAdd(req, res, next) {

         // проверка на количество параметров
         const count_require = 1
         const count_total = 1
         const count_properties = countProperties(req.body)
         console.log(count_properties, "count of properties");
 
         if (count_properties < count_require || count_properties > count_total) {
 
             const param = 'services'
             const data = i18n.__('validation.isMatch', ` ${count_total}`, `${count_properties}`)
             const bad_request_error = new Api400Error(param, data)
 
             console.log(bad_request_error, ` ------> bad_request_error in forAdd function at the servicesprovider_form_check.js`)
             return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
         }
         // проверка на налиние параметров
        if (req.body.hasOwnProperty('services')) {
            console.log(req.body.services, " services")
            return next()
        } else {
            const param = ' services'
            const data = i18n.__('validation.isProvided', ' services')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forAdd function at the servicesprovider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }
}

const serviceproviderFormCheck = new ServiceproviderFormCheck();
export { serviceproviderFormCheck }