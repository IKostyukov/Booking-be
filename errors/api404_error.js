import httpStatusCodes from'./http_status_codes.js';
import BaseError from './base_error.js';

class Api404Error extends BaseError {
    constructor (    
                param,
                description,
                statusCode = httpStatusCodes.NOT_FOUND,
                name ='Not Found.',
                isOperational = true
                ) {
        super(param, description,  statusCode,   name, isOperational)
    }
}

export default Api404Error