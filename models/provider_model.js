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
            console.log(is_exist.rows, `----> is_exist. rows in isExist function with provider_id = ${provider_id}  at  provider_model.js`)
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
    async findOne(provider_id) {
        try {
            const sql = `SELECT  *  FROM providers
            WHERE id = ${provider_id};`
            // console.log(sql)
            const provider = await db.query(sql)
            console.log(provider.rows, '-----> provider.rows in findOne function at provider_model.js')
            return provider
        } catch (err) {
            console.log(err, `-----> err  in findOne function with provider_id = ${provider_id}  at provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get one provider', `${err.message}`)
        }
    }

    //  ### Получить несколько провайдеров

    async findAll({ state, sortBy, limit, offset, s }) {
        try {
            console.log({ state, sortBy, limit, offset, s })

            let sort_by_field = 'id'
            let sort_by_direction = 'ASC'
            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let sql_query = `SELECT *  FROM providers   `
            const where = `WHERE `
            let condition = ''
            const state_condition = `active = 'true' `
            let search_condition = '';
            if (s) {
                const provider_name = s.providerName;
                const providertype_id = s.providertypeId ? s.providertypeId : null;
                const user_id = s.userId ? s.userId : null;
                const location = s.location;
                const address = s.address;
                const post_index = s.postIndex ? s.postIndex : null;
                const rating = s.rating ? s.rating : null;
                const distance_from_center = s.distanceFromCenter ? s.distanceFromCenter : null;

                search_condition = `provider_name LIKE '%'||'${provider_name}'||'%' 
                OR providertype_id = ${providertype_id}
                OR user_id = ${user_id}
                OR location LIKE '%'||'${location}'||'%'
                OR address LIKE '%'||'${address}'||'%'
                OR post_index LIKE '%'||${post_index}||'%'
                OR rating = ${rating}
                OR distance_from_center = ${distance_from_center}  `
            }

            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(id) AS count FROM providers '
            const and = 'AND '
            const end = '; '

            if (state && s) {
                condition += state_condition + and + search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else if (state) {
                condition += state_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else if (s) {
                condition += search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + end
            } else {
                sql_query += filter + end + query_count + end
            }

            console.log(sql_query, `-----> sql_query  in findAll function  at provider_model.js`)
            const providers = await db.query(sql_query)
            return providers

            //         const sql = `SELECT *  FROM providers  
            //         WHERE 
            //         provider_name LIKE '%'||'${provider_name}'||'%' 
            //         OR providertype_id = ${providertype_id}
            //         OR user_id = ${user_id}
            //         OR location LIKE '%'||'${location}'||'%'
            //         OR address LIKE '%'||'${address}'||'%'
            //         OR post_index LIKE '%'||${post_index}||'%'
            //         OR rating = ${rating}
            //         OR distance_from_center = ${distance_from_center} ;`
            //         // console.log(sql)
            //         const providers = await db.query(sql)

        } catch (err) {
            console.log(err, `-----> err  in findAll function at provider_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('find all providers', `${err.message}`)
        }
    }

    //  ### Лучшие провайдеры услуг  ###

    async findBest({ state, sortBy, limit, offset }) {
        try {
            let sort_by_field = 'rating'
            let sort_by_direction = 'DESC'
            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let sql_query = `SELECT  r.id AS provider_id, provider_name, 
            location, address, distance_from_center, rating, 
            COUNT(f.id) as feedbacks `
            const fromm = ` FROM providers r 
            INNER  JOIN feedbacks f
            ON  r.id = f.provider_id  `
            const where = `WHERE `
            let condition = ''
            const state_condition = `active = 'true' `
            let search_condition = ` rating > 90   `

            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = ' SELECT COUNT(r.id) AS count  '
            const group = 'GROUP BY r.id '
            const and = 'AND '
            const end = '; '

            if (state) {
                condition += state_condition + and + search_condition
                sql_query += fromm + where + condition + group + filter + end + query_count + fromm + where + condition + end

            } else {
                condition += search_condition
                sql_query += fromm + where + condition + group + filter + end + query_count + fromm + where + condition + end
            }

            console.log(sql_query, `-----> sql_query  in findBest function  at provider_model.js`)
            const all_activitirs = await db.query(sql_query)
            return all_activitirs

            //    `SELECT 
            //     r.id, provider_name, 
            //     location, address, distance_from_center, rating, 
            //     COUNT(f.id) as feedbacks  
            //     FROM providers r 
            //     INNER  JOIN feedbacks f
            //         ON  r.id = f.provider_id 
            //     WHERE rating > 90  
            //     GROUP BY r.id;`

        } catch (err) {
            console.log(err, `-----> err in findBest function  at provider_model.js`)
            throw new Api500Error('get best providers', `${err.message}`)
        }
    }
}

const providermodel = new ProviderModel()
export { providermodel }