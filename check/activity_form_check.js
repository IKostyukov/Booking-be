
const countProperties = (obj) => {
    let count = 0;    
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }    
    return count;
}

class ActivityFormCheck {    

    forCreate (req, res, next) {

        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties !== 1) { // проверка на количество параметров
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "Bad Request"
                    },
                "data": {
                    "activity_name" : `one parameter required but received ${count_properties}`,
                }
                }
            console.log(result, ` --->  in the ActivityFormCheck.forCreate`)    
            return res.status(400).json(result)
        }

        if (req.body.hasOwnProperty('activity_name')) {  // проверка на налиние параметров
            console.log(req.body.activity_name, "activity_name")
            return next()
        }else{    
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "bad request"
                    },
                "data": {
                    "activity_name" : "activity_name could not be absent.",
                }
                }
            console.log(result,  ` ---> in the ActivityFormCheck.forCreate`)    
            res.status(400).json(result)    
        }
    }

    forActivate (req, res, next) {

        const count_properties = countProperties(req.body) 
        console.log(count_properties, "count of properties");    

        if (count_properties !== 1) { // проверка на количество параметров
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "Bad Request"
                    },
                "data": {
                    "active" : `one parameter required but received ${count_properties}`,
                }
            }
            console.log(result, ` ---> in the ActivityFormCheck.forActivate`)    
            return res.status(400).json(result)
        }

        if (req.body.hasOwnProperty('active')) {  // проверка на налиние параметров
            console.log(req.body.active, " - active")
            return next()
        }else{    
            const result = {
                "success": false,
                "error": {
                    "code" : 400,
                    "message" : "bad request"
                    },
                "data": {
                    "active" : "active could not be absent.",
                }
                }
            console.log(result,  ` ---> in the ActivityFormCheck.forActivate`)    
            res.status(400).json(result)    
        }
    }
}

const activityFormCheck = new ActivityFormCheck();
export {activityFormCheck}
