import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

// import  languages_json  from '../enums/languages.json';
import { languages_enums } from '../enums/languages_enums.js';

import { timetablemodel } from './timetable_model.js';
import { servicemodel } from './service_model.js';
import { descriptionmodel } from './description_model.js';
import { equipmentprovidermodel } from './equipmentprovider_model.js';
import { faremodel } from './fare_model.js';


const db = pool

class ProviderModel {

    async isExist(provider_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM providers WHERE id = ${provider_id}) AS "exists";`
            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, '----> is_exist. rows in isExist function with provider_id = ${provider_id}  at  provider_model.js')
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with provider_id = ${provider_id}  at  provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('provider_id', `${err.message}`)
        }
    }

    async isUnique(provider_name) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM providers WHERE provider_name = '${provider_name}') AS "exists";`

            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, `----> is_unique. rows in isExist function with provider_name = ${provider_name}  at  provider_model.js`)
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isUnique function with provider_name = ${provider_name}  in provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('provider_name', `${err.message}`)
        }
    }


    //  ### Сщздать провафйдера услуг ###

    async create(provider_name, user_id, timetable_id, providertype_id, recreationfacilitytype_id, location, address, post_index, geolocation) {
        try {
            const new_provider = await db.query(`INSERT INTO providers(
                provider_name, user_id, timetable_id, providertype_id,
                recreationfacilitytype_id, location, address, post_index, geolocation)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING * ; `,
                [provider_name, user_id, timetable_id, providertype_id,
                    recreationfacilitytype_id, location, address, post_index, geolocation])
            // console.log(new_provider.rows, "Test provider")
            if (new_provider.rows.lenght !== 0) {
                return new_provider
            }
        } catch (err) {
            console.log(err, `-----> err in create function with provider_name = ${provider_name}  at provider_model.js`)
            throw new Api500Error('create provider', `${err.message}`)
        }
    }

    //  ### Обновить общую информацию о провайдере

    async update(provider_id, provider_name, providertype_id, recreationfacilitytype_id, user_id, location, address, post_index) {
        try {
            const sql = `UPDATE providers
            SET provider_name = '${provider_name}', user_id = ${user_id}, providertype_id = ${providertype_id},
            recreationfacilitytype_id = ${recreationfacilitytype_id}, location ='${location}', address = '${address}', post_index = ${post_index}, mtime = NOW()
            WHERE id = ${provider_id} RETURNING *;`
            // console.log(sql)
            const updated_provider = await db.query(sql)
            return updated_provider
        } catch (err) {
            console.log(err, `-----> err in update function with provider_id = ${provider_id}  at provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('update provider', `${err.message}`)
        }
    }

    //  ### Активировать провайдера

    async activate(provider_id, active) {
        try {
            const sql = `UPDATE providers
            SET active = ${active}
            WHERE id = ${provider_id} RETURNING *;`
            // console.log(sql)
            const updated_provider = await db.query(sql)
            console.log(updated_provider.rows, `-----> updated_provider.rows in activate function with provider_id = ${provider_id}  at provider_model.js`)
            return updated_provider
        } catch (err) {
            console.log(err, `-----> err in activate function with provider_id = ${provider_id}  at provider_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error('activate provider', `${err.message}`)
        }
    }

    //  ### Удалить  провайдера

    async delete(provider_id) {
        try {
            const sql = `DELETE FROM providers
            WHERE id = ${provider_id} RETURNING *;`
            // console.log(sql)
            const deleted_provider = await db.query(sql)
            return deleted_provider
        } catch (err) {
            console.log(err, `-----> error  in delete function with provider_id = ${provider_id}  at provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete provider', `${err.message}`)
        }
    }

    //  ### Получить  провайдера 

    async getOne(provider_id) {
        try {
            const sql = `SELECT  *  FROM providers
            WHERE id = ${provider_id};`
            // console.log(sql)
            const provider = await db.query(sql)
            console.log(provider.rows, '-----> provider.rows in getOneProvider function at provider_model.js')
            return provider
        } catch (err) {
            console.log(err, `-----> err  in getOne function with provider_id = ${provider_id}  at provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get one provider', `${err.message}`)
        }
    }

    //  ### Получить несколько провайдеров

    async getAll(provider_name,
        providertype_id,
        user_id,
        location,
        address,
        post_index,
        rating,
        distance_from_center) {
        try {
            const sql = `SELECT *  FROM providers  
            WHERE 
            provider_name LIKE '%'||'${provider_name}'||'%' 
            OR providertype_id = ${providertype_id}
            OR user_id = ${user_id}
            OR location LIKE '%'||'${location}'||'%'
            OR address LIKE '%'||'${address}'||'%'
            OR post_index LIKE '%'||${post_index}||'%'
            OR rating = ${rating}
            OR distance_from_center = ${distance_from_center} ;`
            // console.log(sql)
            const providers = await db.query(sql)
            //  SQL запрос нужно доработать, т.к. он работает только если есть все поля с числами. 
            // Иначе invalid input syntax for type integer: "NaN"
            return providers
        } catch (err) {
            console.log(err, `-----> err  in getAll function with provider_name = ${provider_name}  at provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get list of providers', `${err.message}`)
        }
    }

    //  ### Лучшие провайдеры услуг  ###

    async getBest() {
        try {
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
        } catch (err) {
            console.log(err, `-----> err in getBest function with provider_name = ${provider_name}  at provider_model.js`)
            throw new Api500Error('get best providers', `${err.message}`)
        }
    }
}

const providermodel = new ProviderModel()
export { providermodel }