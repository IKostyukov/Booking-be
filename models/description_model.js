import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';
const db = pool

class DeckriptionModel {

    //  ### Описание провайдера (descriptions) ###

    async createNewDescription(provider_id, description) {
        try {
            // console.log(provider_id, description)
            let sql_query = ''
            description.forEach(function create_sql_query(descript) {
                const { locale, descriptiontype, content } = descript
                // console.log(provider_id, locale, descriptiontype, content)
                sql_query += `INSERT INTO descriptions(
                    provider_id, locale, descriptiontype, content )
                    VALUES (${provider_id}, '${locale}', '${descriptiontype}', '${content}')
                RETURNING *;`
            })
            // console.log(sql_query)
            const added_description = await db.query(sql_query)
            if (description.length > 1) {
                // console.log(added_description[0].rows, ' ----> added_description[0].rows at description_model.js')
                return added_description[0]
            } else {
                // console.log(added_description.rows, ' ----> added_description.rows at description_model.js')
                return added_description
            }
        } catch (err) {
            console.log(err, `-----> err in createNewDescription function with provider_id = ${provider_id}  at description_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create new descriptions', `${err.message}`)
        }
    }

    // Обновить нельзя, только удалить

    // async updateOneDescription (description_id, provider_id, locale, descriptiontype, content) {
    //     console.log(provider_id, locale)
    //     const sql = `UPDATE descriptions
    //     SET  provider_id=${provider_id}, locale='${locale}',
    //     descriptiontype='${descriptiontype}', content='${content}'
    //     WHERE id = ${description_id}
    //     RETURNING *;` 
    //     console.log(sql)
    //     const new_description = await db.query(sql)

    //     return new_description
    // }


    async deleteAllDescriptionsOfProvider(provider_id) {
        try {
            console.log(provider_id)
            const sql = `DELETE FROM  descriptions
            WHERE provider_id = ${provider_id}
            RETURNING *;`
            // console.log(sql)
            const deleted_description = await db.query(sql)
            return deleted_description
        } catch (err) {
            console.log(err, `-----> err in deleteAllDescriptionsOfProvider function with provider_id = ${provider_id}  at description_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete all descriptions', `${err.message}`)
        }
    }

    async getOneDescription(description_id) {
        try {
            console.log(description_id)
            const sql = `SELECT id AS description_id, provider_id, locale, descriptiontype, content
            FROM descriptions
            WHERE id =${description_id};`
            console.log(sql)
            const one_description = await db.query(sql)
            return one_description
        } catch (err) {
            console.log(err, `-----> err in getOneDescription function with description_id = ${description_id}  at description_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('delete  one description', `${err.message}`)
        }
    }

    async getAllDescriptionsOfProvider(provider_id) {
        try {
            console.log(provider_id)
            const sql = `SELECT id AS description_id, provider_id, locale, descriptiontype, content
            FROM descriptions
            WHERE provider_id =${provider_id};`
            console.log(sql)
            const all_description = await db.query(sql)
            return all_description
        } catch (err) {
            console.log(err, `-----> err in getAllDescriptionsOfProvider function with description_id = ${description_id}  at description_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('get all descriptions', `${err.message}`)
        }
    }
}

const descriptionmodel = new DeckriptionModel()
export { descriptionmodel }