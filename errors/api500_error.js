import httpStatusCodes from'./http_status_codes.js';
import BaseError from './base_error.js';

class Api500Error extends BaseError {
    constructor (    
                param,
                description,
                statusCode = httpStatusCodes.INTERNAL_SERVER,
                name ='Inrernal Server Error.',
                isOperational = true
                ) {
        super(param, description,  statusCode,   name, isOperational)
    }
}

export default Api500Error