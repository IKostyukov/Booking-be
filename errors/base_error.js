class BaseError extends Error {
    constructor (param, description, statusCode, name, isOperational) {
    super(description)
   
    Object.setPrototypeOf(this, new.target.prototype)  // Смотри сноску
    this.success = false,
    this.statusCode = statusCode,
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
   
//    Предупреждение: Изменение прототипа [[Prototype]] объекта является, 
//    по самой природе оптимизации доступа к свойствам в современных движках 
//    JavaScript, очень медленной операцией, это справедливо для любого браузера
//     и движка JavaScript. Изменение прототипов очень тонко и обширно влияет на 
//     производительность, причём это влияние не ограничивается просто временем, 
//     проведённым внутри метода Object.setPrototypeOf(), оно может распространяться
//      на любой код, который имеет доступ к любому объекту, чей прототип [[Prototype]] 
//      был изменён. Если вы заботитесь о производительности, вы никогда не должны изменять 
//      прототип [[Prototype]] объекта. Вместо этого создайте объект с нужным прототипом [[Prototype]], 
//      с помощью метода Object.create().

//  https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf