import { pool } from '../db.js';
const db = pool

class DeckriptionModel {

     //  ### Описание провайдера (descriptions) ###

     async createNewDescription (provider_id, locale, descriptiontype, content) {
        console.log(provider_id, locale)
        const sql = `INSERT INTO descriptions(
            recipientofservices_id, locale, descriptiontype, content )
            VALUES (${provider_id}, '${locale}', '${descriptiontype}', '${content}')
        RETURNING *;` 
        console.log(sql)
        const new_description = await db.query(sql)      
        return new_description
    }
    

    // async updateOneDescription (description_id, provider_id, locale, descriptiontype, content) {
    //     console.log(provider_id, locale)
    //     const sql = `UPDATE descriptions
    //     SET  recipientofservices_id=${provider_id}, locale='${locale}',
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
        WHERE recipientofservices_id = ${provider_id}
        RETURNING *;` 
        console.log(sql)
        const deleted_description = await db.query(sql)
      
        return deleted_description
    }
}

    const descriptionmodel = new DeckriptionModel()
    export { descriptionmodel } 