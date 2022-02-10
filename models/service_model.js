import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class ServiceModel {

    //  ### Создать удобство ###
    async ceate (service_name) {
        try {
            // console.log("Test")
            const new_service = db.query(`INSERT INTO services
                (service_name)
                VALUES ($1) 
                RETURNING * ;`, [service_name])
            console.log(new_service)
            return new_service 
        } catch (err) {                                       
            console.log(err, `-----> err in create function with service_name = ${service_name}  at service_model.js`)                                                                  
            throw new Api500Error( 'service_name', `${err.message}`)                                                                  
        }         
    }

    //  ### Обновить удобство ###
    async update (service_id, service_name) {
        try {
            console.log(service_id, service_name)
    
            const new_service = db.query(`UPDATE services
            SET  service_name = $1
            WHERE id = $2
                RETURNING * ;`, [service_name, service_id])
            console.log(new_service)
            return new_service   
        }catch(err){                                       
            console.log(err, `-----> err in update function with service_id = ${service_id}  at service_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'service_id', `${err.message}`)                                                                  
        }       
    }

     //  ### Активировать удобство ###
    async activate(service_id, active) {
        try {
            const activated_service = await db.query(`UPDATE services
            SET active = $2 WHERE id = $1 RETURNING *;`,
            [ service_id, active])
            return  activated_service
        }catch(err) {                                       
            console.log(err, `-----> err in activate function with service_id = ${service_id}  at service_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'activity_id', `${err.message}`)                                                                  
        }
    }

     //  ###  Удалить удобство ###
    async delete(service_id) {
        try {
            const deleted_service = await db.query(`DELETE FROM services WHERE id = $1
            RETURNING *;`, [service_id])
            return deleted_service
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with service_id = ${service_id}  at service_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'service_id', `${err.message}`)                                                                 
        }
    }

     //  ###  Получить одно удобство ###
     async getOne(service_id) {
        try {
            const sql = `SELECT id AS service_id, service_name, active
            FROM services WHERE id = ${service_id};`
            // console.log(sql)
            const one_service = await db.query(sql)
            return one_service
        } catch (err) {                                       
            console.log(err, `-----> err  in getOne function with service_id = ${service_id}  at service_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'service_id', `${err.message}`)                                                                  
        }  
    }

     //  ###  Получить все удобства ###
     async getAll() {
        try {
            const all_service = await db.query(`SELECT id AS service_id, service_name, active
            FROM services;`)
            return all_service
        } catch (err) {                                       
            console.log(err, `-----> err  in getAll function with service_name = ${service_name}  at service_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'service_name', `${err.message}`)                                                                  
        } 
    }

    async isExist(service_id) {
        try{
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM services WHERE id = ${service_id}) AS "exists";`
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with service_id = ${service_id}  at  service_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'service_id', `${err.message}`)                                                                  
        }
    }
    
            // ИНФОРЬФЦИЯ ИЗ КОНТРОЛЛЕРА ПРОВАЙДЕРА ---> Это второй вариант, 
            // Eсли выбрать второй, то первый надо поднять выше для проверки IsInt в массиве services). 
            // Плюсы - проверяем одним запросом методом  isExistList. 
            // Минусы - цикл в модели и цикл для проверки пезультатов в контроллере

    // async isExistList(services) {
    //     try {
    //         let sql_query = ''
    //         console.log('services -', services)
    //         for (let i = 0; i < services.length; i += 1) {
    //             sql_query += `SELECT EXISTS (SELECT 1
    //                 FROM services WHERE id = ${services[i]}) AS "exists";`
    //         }
    //         const found_services = await db.query(sql_query)
    //         console.log(found_services, `-----> found_services  in isExistList function with services = ${services}  at service_model.js`)

    //         if (found_services.length > 1) {
    //             // console.log(added_service[0].rows, ' ----> added_service[0].rows at serviceprovider_model.js')
    //             return found_services
    //         } else {
    //             // console.log(added_service.rows, ' ----> added_service.rows at serviceprovider_model.js')
    //             return [found_services]
    //         }
    //     } catch (err) {
    //         console.log(err, `-----> err  in isExistList function with services = ${services}  at service_model.js`)
    //         // console.log(err.message, '-----> err.message')                                                                   
    //         throw new Api500Error('is exist list of services', `${err.message}`)
    //     }
    // }

    async isUnique(service_name) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM services WHERE service_name = '${service_name}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, '---------> is_unique.rows')
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isExist function with service_name = ${service_name}  in service_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'service_name', `${err.message}`)                                                                
        }
    }
}

    const servicemodel = new ServiceModel()
    export { servicemodel } 