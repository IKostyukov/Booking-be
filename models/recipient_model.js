import { pool } from '../db.js';
// import  languages_json  from '../DataLocale/languages.json';
import { languages_enums } from '../DataLocale/languages_enums.js';

import { timetablemodel } from './timetable_model.js';
import { servicemodel } from './service_model.js';
import { descriptionmodel } from './description_model.js';
import { equipmentrecipientmodel } from './equipmentrecipient_model.js';
import { faremodel } from './fare_model.js';


const db = pool

class RecipientModel {


//  ### Лучшие провайдеры услуг  ###
     
    async getBest(req, res) {
        const best_recipients = await db.query(`SELECT 
        r.id, recipientofservices_name, 
        location, address, distance_from_center, rating, 
        COUNT(f.id) as feedbacks  
        FROM recipientofservices r 
        INNER  JOIN feedbacks f
            ON  r.id = f.recipientofservices_id 
        WHERE rating > 90  
        GROUP BY r.id;`)
        return best_recipients
    }

 //  ### Сщздать провафйдера услуг ###

    async createNewRecipient(recipientofservices_name, user_id, timetable_id, recipientofservicestype_id, location, address, post_index, geolocation) {     

        const new_recipient = await db.query(`INSERT INTO recipientofservices(
            recipientofservices_name, user_id, timetable_id, recipientofservicestype_id,
            location, address, post_index, geolocation)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING * ; `,
            [recipientofservices_name, user_id, timetable_id, recipientofservicestype_id,
            location, address, post_index, geolocation])    
        // console.log(new_recipient.rows, "Test recipient")
        return new_recipient
    }
    
     //  ### Активировать провайдера

    async activateOneProvider(provider_id, active) {
        const sql = `UPDATE recipientofservices
        SET active = ${active}
        WHERE id = ${provider_id} RETURNING *;`
        console.log(sql)
        const updated_provider = await db.query(sql)
        return updated_provider
    }

    //  ### Обновить общую информацию о провайдере

    async updateOneProvider(recipientofservices_name, recipientofservicestype_id, user_id, location, address, post_index, provider_id) {
        const sql = `UPDATE recipientofservices
        SET recipientofservices_name='${recipientofservices_name}', user_id =${user_id}, recipientofservicestype_id=${recipientofservicestype_id},
        location='${location}', address='${address}', post_index=${post_index}, mtime = NOW()
        WHERE id = ${provider_id} RETURNING *;`
        console.log(sql)
        const updated_provider = await db.query(sql)
        return updated_provider
    }

    
     //  ### Удалить  провайдера

     async deleteOneProvider(provider_id) {
        const sql = `DELETE FROM recipientofservices
        WHERE id = ${provider_id} RETURNING *;`
        console.log(sql)
        const deleted_provider = await db.query(sql)
        return deleted_provider
    }

    //  ### Получить  провайдера 

    async getOneProvider(provider_id) {
        const sql = `SELECT  *  FROM recipientofservices
        WHERE id = ${provider_id};`
        console.log(sql)
        const provider = await db.query(sql)
        return provider
    }

     //  ### Получить несколько провайдеров

    async getListProviders( recipientofservices_name,
                            recipientofservicestype_id,
                            user_id,
                            location,
                            address,
                            post_index,
                            rating,
                            distance_from_center) {
        // const sql = `SELECT  *  FROM recipientofservices
        // WHERE id = ${provider_id};`
        // console.log(sql)

        const providers = await db.query(`SELECT *  FROM recipientofservices  
        WHERE 
        recipientofservices_name LIKE '%'||$1||'%' 
        OR recipientofservicestype_id = $2
        OR user_id = $3
        OR location LIKE '%'||$4||'%'
        OR address LIKE '%'||$5||'%'
        OR post_index LIKE '%'||$6||'%'
        OR rating = $7
        OR distance_from_center = $8 ;`, 
            [
                recipientofservices_name,
                recipientofservicestype_id,
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

    //  ### Добавление удобствa  провайдеру ###
    async addOneServiceToProvider (recipientofservices_id, service_id) {
        console.log('recipientofservices_id -', recipientofservices_id, 'service_id -', service_id)
        //  Нужно проверку на получение результатов от БД.  Вариант  - нет такого инвентаря
        const added_service = await db.query(`INSERT INTO services_recipientofservices(
            recipientofservices_id, service_id)
            VALUES ($1, $2)
            RETURNING *;`,
        [recipientofservices_id, service_id])

        return added_service
    }

    //  ###  Удаление удобствa у провайдера ###

    async deleteOneServicesOfProvider (provider_id) {
        const deleted_service = await db.query(`DELETE FROM services_recipientofservices
        WHERE recipientofservices_id = ${provider_id} RETURNING *;`);
        return deleted_service
    }

    //  ### Редактирование удобстa у провайдера ###



}

const recipientmodel = new RecipientModel()
export { recipientmodel } 