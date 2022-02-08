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

class TimetableFormCheck {

    forCreateUpdate(req, res, next) {

        // проверка на количество параметров
        const count_require = 1
        const count_total = 1
        const count_properties = countProperties(req.body)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {

            const param = 'in create form of timetable '
            const data = i18n.__('validation.isMatch', ` ${count_total}  `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the timetable_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров
        if (req.body.hasOwnProperty('timetable')) {
            const timetable = req.body.timetable
            // console.log(timetable, " hasOwnProperty timetable")
            for (let day = 0; day < timetable.length; day++) {
                // console.log(timetable[day].start_time, day, ' ---> day')
                const { start_time, end_time } = timetable[day]
                if (!start_time) {
                    const param = 'start_time'
                    const data = i18n.__('validation.isProvided', 'timetable/  start_time ')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the timetable_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                } else if (!end_time) {
                    const param = 'end_time'
                    const data = i18n.__('validation.isProvided', 'timetable/   end_time')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the timetable_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                } else if (day === timetable.length - 1) {
                    console.log(' TimetableFormCheck  ------------>>>>> OK')
                    return next()
                }
            }
        } else {
            const param = ' timetable'
            const data = i18n.__('validation.isProvided', ' timetable')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreateUpdate function at the timetable_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }
}

const timetableFormCheck = new TimetableFormCheck();
export { timetableFormCheck }
