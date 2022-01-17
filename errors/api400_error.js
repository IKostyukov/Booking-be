import httpStatusCodes from'../enums/http_status_codes_enums.js';
import BaseError from './base_error.js';

class Api400Error extends BaseError {
    constructor (    
                param,
                description,
                statusCode = httpStatusCodes.BAD_REQUEST,
                name ='Bad Request.',
                isOperational = true,
                success = false
                ) {
        super(param, description,  statusCode, name, isOperational, success)
    }
}

export default Api400Error