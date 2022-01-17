import httpStatusCodes from'../enums/http_status_codes_enums.js';
import BaseError from './base_error.js';

class Api500Error extends BaseError {
    constructor (    
                param,
                description,
                statusCode = httpStatusCodes.INTERNAL_SERVER,
                name ='Inrernal Server Error.',
                isOperational = true,
                success = false
                ) {
        super(param, description,  statusCode, name, isOperational, success)
    }
}

export default Api500Error