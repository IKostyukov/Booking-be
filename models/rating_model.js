import { pool } from '../db.js';
const db = pool

class RatingModel {

    async add(provider_id, user_id, clearness, staff, view ) {
        const new_rating = await db.query(`INSERT INTO rating 
        (provider_id, user_id, clearness, staff, view ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`, [provider_id, user_id, clearness, staff, view ])        
        return  new_rating    
    }
        
    async update (rating_id, provider_id, user_id, clearness, staff, view ) {
        const updated_rating = await db.query(`UPDATE rating
        SET provider_id=$2, user_id=$3, clearness=$4, staff=$5, view=$6 
        WHERE id = $1
        RETURNING *;`, [rating_id, provider_id, user_id, clearness, staff, view ])
        return updated_rating
    }

    async delete(rating_id) {        
        const deleted_rating = await db.query(`DELETE FROM rating
        WHERE id = $1 RETURNING *;`, [ rating_id])
        return deleted_rating
    }
   
    async connectToFeedback(rating_id, message_id) {
        const get_ratings = await db.query(`INSERT INTO ratingwithfeedbacks 
        (rating_id, message_id) VALUES ($1, $2) RETURNING * ;`, [rating_id, message_id])       
        console.log(get_ratings.rows)
        return get_ratings
    } 
}

const ratingmodel = new RatingModel();
export { ratingmodel };