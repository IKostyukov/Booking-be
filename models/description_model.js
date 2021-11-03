import { pool } from '../db.js';
const db = pool

class DeckriptionModel {

     //  ### Описание провайдера (descriptions) ###

     async createNewDescription (provider_id, locale, descriptiontype, content) {
        console.log(provider_id, locale)
        const sql = `INSERT INTO descriptions(
            provider_id, locale, descriptiontype, content )
            VALUES (${provider_id}, '${locale}', '${descriptiontype}', '${content}')
        RETURNING *;` 
        console.log(sql)
        const new_description = await db.query(sql)      
        return new_description
    }
    

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


    async deleteAllDescriptionsOfProvider (provider_id) {
        console.log(provider_id)
        const sql = `DELETE FROM  descriptions
        WHERE provider_id = ${provider_id}
        RETURNING *;` 
        console.log(sql)
        const deleted_description = await db.query(sql)
      
        return deleted_description
    }

    async getOneDescription(description_id) {
        console.log(description_id)
        const sql = `SELECT id AS description_id, provider_id, locale, descriptiontype, content
        FROM descriptions
        WHERE id =${description_id};` 
        console.log(sql)
        const one_description = await db.query(sql)
      
        return one_description
    }

    async getAllDescriptionsOfProvider(provider_id) {
        console.log(provider_id)
        const sql = `SELECT id AS description_id, provider_id, locale, descriptiontype, content
        FROM descriptions
        WHERE provider_id =${provider_id};` 
        console.log(sql)
        const all_description = await db.query(sql)
      
        return all_description
    }
}

    const descriptionmodel = new DeckriptionModel()
    export { descriptionmodel } 