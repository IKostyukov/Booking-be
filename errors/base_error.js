class BaseError extends Error {
    constructor (param, description, statusCode, name, isOperational) {
    super(description)
   
    Object.setPrototypeOf(this, new.target.prototype)
    this.success = false
    this.error = {
        'code': statusCode,
        'message': name,
    },
    this.data = {
        [param] : description,
        'isOperational': isOperational
    }
    Error.captureStackTrace(this)
    }
   }
   
   export default BaseError