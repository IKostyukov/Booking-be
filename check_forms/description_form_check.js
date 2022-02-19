import i18n from 'i18n';
import Api400Error from '../errors/api400_error.js';
import { countProperties, checkQueryProperties } from './_form_check_methods.js';


class DescriptionFormCheck {

    forCreateUpdate(req, res, next) {

        if (req.body.hasOwnProperty('description')) {

            const count_require = 3
            const count_total = 3
            const description = req.body.description;
            console.log(description, "description")
                  
            for (let i = 0; i < description.length; i++) {                
                 // проверка на количество параметров
                const count_properties = countProperties(description[i])
                console.log(count_properties, "count of properties");

                if (count_properties < count_require || count_properties > count_total) {
                    const param = 'in create form of description'
                    const data = i18n.__('validation.isMatch', ` ${count_total}`, `${count_properties}`)
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the description_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }

                 // проверка на налиние параметров
                const { locale, descriptiontype, content } = description[i]

                if (!locale) {
                    const param = 'locale'
                    const data = i18n.__('validation.isProvided', 'description/  locale')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the description_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!descriptiontype) {
                    const param = 'descriptiontype'
                    const data = i18n.__('validation.isProvided', 'description/  descriptiontype')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the description_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!content) {
                    const param = 'content'
                    const data = i18n.__('validation.isProvided', 'description/  content')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the description_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                }
            }
            return next()
        }
    }
    
    forRetrieve(req, res, next) {

        // проверка на количество параметров
        const count_require = 0
        const count_total = 3
        const count_properties = countProperties(req.query)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {
            const param = 'retrieve descriptions'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the description_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров            
        const expected_array = ['sortBy', 'size', 'page']
        const check_properties = checkQueryProperties(req.query, expected_array)
        // console.log(check_properties)
        if (check_properties !== true) {
            const param = 'retrieve descriptions'
            const data = i18n.__('validation.isExpected', `${check_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the description_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.query.sortBy) {
            const expected_array_of_sortBy = ['field', 'direction']
            for (let i = 0; i < req.query.sortBy.length; i++) {
                const check_properties_of_sortBy = checkQueryProperties(req.query.sortBy[i], expected_array_of_sortBy)
                if (check_properties_of_sortBy !== true) {
                    const param = 'retrieve promotions'
                    const data = i18n.__('validation.isExpected', `${check_properties_of_sortBy}`)
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the description_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                } else {
                    return next()
                }
            }
        }
        return next()
    }
}

const descriptionFormCheck = new DescriptionFormCheck();
export { descriptionFormCheck }