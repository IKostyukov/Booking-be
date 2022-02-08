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

class ExtratimetableFormCheck {

    forCreateUpdate(req, res, next) {

        // проверка на количество параметров
        const count_require = 3
        const count_total = 3
        const count_properties = countProperties(req.body)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {

            const param = 'in create form of extratimetable '
            const data = i18n.__('validation.isMatch', ` ${count_total}`, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the extratimetable_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров


        if (req.body.hasOwnProperty('date')) {
            console.log(req.body.date, "date")
        } else {
            const param = 'date'
            const data = i18n.__('validation.isProvided', 'date')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the extratimetable_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('start_time')) {
            console.log(req.body.start_time, "start_time")
        } else {
            const param = 'start_time'
            const data = i18n.__('validation.isProvided', 'start_time')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the extratimetable_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('end_time')) {
            console.log(req.body.end_time, "end_time")
        } else {
            const param = 'end_time'
            const data = i18n.__('validation.isProvided', 'end_time')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the extratimetable_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }
}

const extratimetableFormCheck = new ExtratimetableFormCheck();
export { extratimetableFormCheck }