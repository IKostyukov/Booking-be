import httpStatusCodes from'./http_status_codes.js';
import BaseError from './base_error.js';

class Api400Error extends BaseError {
    constructor (    
                param,
                description,
                statusCode = httpStatusCodes.BAD_REQUEST,
                name ='Bad Request.',
                isOperational = true,
                ) {
        super(param, description,  statusCode,   name, isOperational)
    }
}

export default Api400Error