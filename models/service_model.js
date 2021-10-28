import { pool } from '../db.js';
const db = pool

class ServiceModel {

    //  ### Создать удобство ###
    async ceateNewService (service_name) {
        // console.log("Test")
        const new_service = db.query(`INSERT INTO services
            (service_name)
            VALUES ($1) 
            RETURNING * ;`, [service_name])
        console.log(new_service)
        return new_service          
    }

    //  ### Обновить удобство ###
    async updateOneService (service_id, service_name) {
        console.log(service_id, service_name)
        const new_service = db.query(`UPDATE services
        SET  service_name = $1
        WHERE id = $2
            RETURNING * ;`, [service_name, service_id])
        console.log(new_service)
        return new_service          
    }

     //  ### Активировать удобство ###
    async activateOneService(service_id, active) {
        const activated_service = await db.query(`UPDATE services
        SET active = $2 WHERE id = $1 RETURNING *;`,
        [ service_id, active])
        return  activated_service
    }

     //  ###  Удалить удобство ###
    async deleteOneService(service_id) {
        const deleted_service = await db.query(`DELETE FROM services WHERE id = $1
        RETURNING *;`, [service_id])
        return deleted_service
    }

    

    
}

    const servicemodel = new ServiceModel()
    export { servicemodel } 