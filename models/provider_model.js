import { pool } from '../db.js';
// import  languages_json  from '../enums/languages.json';
import { languages_enums } from '../enums/languages_enums.js';

import { timetablemodel } from './timetable_model.js';
import { servicemodel } from './service_model.js';
import { descriptionmodel } from './description_model.js';
import { equipmentprovidermodel } from './equipmentprovider_model.js';
import { faremodel } from './fare_model.js';


const db = pool

class ProviderModel {


//  ### Лучшие провайдеры услуг  ###
     
    async getBest(req, res) {
        const best_providers = await db.query(`SELECT 
        r.id, provider_name, 
        location, address, distance_from_center, rating, 
        COUNT(f.id) as feedbacks  
        FROM providers r 
        INNER  JOIN feedbacks f
            ON  r.id = f.provider_id 
        WHERE rating > 90  
        GROUP BY r.id;`)
        return best_providers
    }
    
 //  ### Сщздать провафйдера услуг ###
 
    async createNewProvider(provider_name, user_id, timetable_id, providertype_id, location, address, post_index, geolocation) {     

        const new_provider = await db.query(`INSERT INTO providers(
            provider_name, user_id, timetable_id, providertype_id,
            location, address, post_index, geolocation)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING * ; `,
            [provider_name, user_id, timetable_id, providertype_id,
            location, address, post_index, geolocation])    
        // console.log(new_provider.rows, "Test provider")
        return new_provider
    }
    
     //  ### Активировать провайдера

    async activateOneProvider(provider_id, active) {
        const sql = `UPDATE providers
        SET active = ${active}
        WHERE id = ${provider_id} RETURNING *;`
        console.log(sql)
        const updated_provider = await db.query(sql)
        return updated_provider
    }

    //  ### Обновить общую информацию о провайдере

    async updateOneProvider(provider_name, providertype_id, user_id, location, address, post_index, provider_id) {
        const sql = `UPDATE providers
        SET provider_name='${provider_name}', user_id =${user_id}, providertype_id=${providertype_id},
        location='${location}', address='${address}', post_index=${post_index}, mtime = NOW()
        WHERE id = ${provider_id} RETURNING *;`
        console.log(sql)
        const updated_provider = await db.query(sql)
        return updated_provider
    }

    
     //  ### Удалить  провайдера

     async deleteOneProvider(provider_id) {
        const sql = `DELETE FROM providers
        WHERE id = ${provider_id} RETURNING *;`
        console.log(sql)
        const deleted_provider = await db.query(sql)
        return deleted_provider
    }

    //  ### Получить  провайдера 

    async getOneProvider(provider_id) {
        const sql = `SELECT  *  FROM providers
        WHERE id = ${provider_id};`
        console.log(sql)
        const provider = await db.query(sql)
        return provider
    }

     //  ### Получить несколько провайдеров

    async getListProviders( provider_name,
                            providertype_id,
                            user_id,
                            location,
                            address,
                            post_index,
                            rating,
                            distance_from_center) {
        // const sql = `SELECT  *  FROM provider
        // WHERE id = ${provider_id};`
        // console.log(sql)

        const providers = await db.query(`SELECT *  FROM providers  
        WHERE 
        provider_name LIKE '%'||$1||'%' 
        OR providertype_id = $2
        OR user_id = $3
        OR location LIKE '%'||$4||'%'
        OR address LIKE '%'||$5||'%'
        OR post_index LIKE '%'||$6||'%'
        OR rating = $7
        OR distance_from_center = $8 ;`, 
            [
                provider_name,
                providertype_id,
                user_id,
                location,
                address,
                post_index,
                rating,
                distance_from_center
            ])
        
//  SQL запрос нужно доработать, т.к. он работает только если есть все поля с числами. 
// Иначе invalid input syntax for type integer: "NaN"
        return providers
    }
}

const providermodel = new ProviderModel()
export { providermodel } 