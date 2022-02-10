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
}

const descriptionFormCheck = new DescriptionFormCheck();
export { descriptionFormCheck }