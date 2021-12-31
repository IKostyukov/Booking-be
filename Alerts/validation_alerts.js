import {languages_enums} from "../DataLocale/languages_enums.js";


const language = 'ru_RU'

class ValidationAlert {
    notEmpty(field){
        const alert_message = field + ' could not be empty'
        return alert_message

    }
    isString(field){
        const alert_message = field + ' must be srting'
        return alert_message

    }
    isBoolean(field){
        const alert_message = field + ' must be boolean'
        return alert_message

    }
    isInt(field){
        const alert_message = field + ' must be integer'
        return alert_message

    }
}

const validationAlert = new ValidationAlert()
export {validationAlert}