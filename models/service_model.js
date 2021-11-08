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
        SET  service_id = $1
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

     //  ###  Получить одно удобство ###
     async getOneService(service_id) {
        const sql = `SELECT id AS service_id, service_name, active
        FROM services WHERE id = ${service_id};`
        // console.log(sql)
        const one_service = await db.query(sql)
        return one_service
    }

     //  ###  Получить все удобства ###
     async getAllServices() {
        const all_service = await db.query(`SELECT id AS service_id, service_name, active
        FROM services;`)
        return all_service
    }

    //  ### Добавление удобствa  провайдеру ###
    async addOneServiceToProvider (provider_id, service_id) {
        console.log('provider_id -', provider_id, 'service_id -', service_id)
        //  Нужно проверку на получение результатов от БД.  Вариант  - нет такого инвентаря
        const added_service = await db.query(`INSERT INTO services_providers(
            provider_id, service_id)
            VALUES ($1, $2)
            RETURNING *;`,
        [provider_id, service_id])

        return added_service
    }

    //  ###  Удаление удобствa у провайдера ###

    async deleteOneServicesOfProvider (provider_id) {
        const deleted_service = await db.query(`DELETE FROM services_providers
        WHERE provider_id = ${provider_id} RETURNING *;`);
        return deleted_service
    }

    //  ### Редактирование удобстa у провайдера ###

        // delete + create
}

    const servicemodel = new ServiceModel()
    export { servicemodel } 