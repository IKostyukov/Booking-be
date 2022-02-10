import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class ServiceProviderModel {

    //  ### Добавление удобствa  провайдеру ###
    async addAllServices(provider_id, services) {
        try {
            let sql_query = ''
            console.log('provider_id -', provider_id, 'services -', services)
            for (let i = 0; i < services.length; i += 1) {
                sql_query += `INSERT INTO services_providers (provider_id, service_id) 
                VALUES (${provider_id}, ${services[i]}) RETURNING *;`
            }
            const added_service = await db.query(sql_query)
            if (services.length > 1) {
                // console.log(added_service[0].rows, ' ----> added_service[0].rows at serviceprovider_model.js')
                return added_service[0]
            } else {
                // console.log(added_service.rows, ' ----> added_service.rows at serviceprovider_model.js')
                return added_service
            }
        } catch (err) {
            console.log(err, `-----> err  in addOneServiceToProvider function with provider_id = ${provider_id}  at serviceprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('add service to provider', `${err.message}`)
        }
    }

    //  ###  Удаление удобствa у провайдера ###
    async deleteAll(provider_id) {
        try {
            const deleted_service = await db.query(`DELETE FROM services_providers
            WHERE provider_id = ${provider_id} RETURNING *;`);
            return deleted_service
        } catch (err) {
            console.log(err, `-----> err  in deleteOneServicesOfProvider function with provider_id = ${provider_id}  at serviceprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete services of provider', `${err.message}`)
        }
    }

    //  ### Редактирование удобстa у провайдера ###

    // (deleteAll + create) in controller


    //  ### Получение удобств провайдера ###
    async getAll(provider_id) {
        try {
            const all_services = await db.query(`SELECT 
            sp.provider_id, sp.service_id, s.service_name, s.active
            FROM services_providers sp LEFT JOIN services s
            ON sp.service_id = s.id 
            WHERE provider_id = ${provider_id};`);
            return all_services
        } catch (err) {
            console.log(err, `-----> err  in deleteOneServicesOfProvider function with provider_id = ${provider_id}  at serviceprovider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete services of provider', `${err.message}`)
        }
    }
}

const serviceprovidermodel = new ServiceProviderModel()
export { serviceprovidermodel }