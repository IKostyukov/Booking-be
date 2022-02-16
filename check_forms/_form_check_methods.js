const countProperties = (obj) => {
    let count = 0;    
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }    
    return count;
}

const checkQueryProperties = (obj, expected_array) => {
    for(let prop in obj) {
        if( expected_array.includes(prop) ){
            // console.log(prop, expected_array, ' ---> checkProperties)
            continue
        }else{
            return prop;            
        }
    } 
    return true;
}

export {countProperties}
export {checkQueryProperties}
