import httpStatusCodes from'../enums/http_status_codes_enums.js';
import BaseServerCondition from './base_error.js';
import BaseError from './base_error.js';

class Api404Error extends BaseError {
    constructor (    
                param,
                description,
                statusCode = httpStatusCodes.NOT_FOUND,
                name ='Not Found.',
                isOperational = true,
                success = false
                ) {
        super(param, description, statusCode,  name, isOperational, success )
    }
}

export default Api404Error