import { pool } from '../db.js';
const db = pool

class ServiceProviderModel {
    
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
    async deleteAllServicesOfProvider (provider_id) {
        const deleted_service = await db.query(`DELETE FROM services_providers
        WHERE provider_id = ${provider_id} RETURNING *;`);
        return deleted_service
    }

    //  ### Редактирование удобстa у провайдера ###
        // delete + create

    //  ### Получение удобств провайдера ###
    async getAllServicesOfProvider (provider_id) {

        const all_services = await db.query(`SELECT 
        sp.provider_id, sp.service_id, s.service_name, s.active
        FROM services_providers sp LEFT JOIN services s
        ON sp.service_id = s.id 
        WHERE provider_id = ${provider_id};`);
        return all_services
    }


}

const serviceprovidermodel = new ServiceProviderModel()
export { serviceprovidermodel } 