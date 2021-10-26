import { pool } from '../db.js';
const db = pool

class DeckriptionModel {

     //  ### Описание объекта (descriptions) ###

     async createNewDescription (recipientofservices_id, locale, object, owner, location) {
        console.log(recipientofservices_id, locale) 
        const new_description = await db.query(`INSERT INTO descriptions(
            recipientofservices_id, locale, object, owner, location)
            VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`, [recipientofservices_id, locale, object, owner, location])
        return new_description
    }
}

    const deckriptionmodel = new DeckriptionModel()
    export { deckriptionmodel } 