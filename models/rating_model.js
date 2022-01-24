import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class RatingModel {

    async add(provider_id, user_id, clearness, staff, view ) {
        try{
            const new_rating = await db.query(`INSERT INTO rating 
            (provider_id, user_id, clearness, staff, view ) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`, [provider_id, user_id, clearness, staff, view ])        
            return  new_rating 
        } catch (err) {                                       
            console.log(err, `-----> err in add function with provider_id = ${provider_id}  at rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'new_rating', `${err.message}`)                                                                  
        }   
    }
        
    async update (rating_id, provider_id, user_id, clearness, staff, view ) {
        try{
            const updated_rating = await db.query(`UPDATE rating
            SET provider_id=$2, user_id=$3, clearness=$4, staff=$5, view=$6 
            WHERE id = $1
            RETURNING *;`, [rating_id, provider_id, user_id, clearness, staff, view ])
            return updated_rating
        } catch (err) {                                       
            console.log(err, `-----> err in update function with rating_id = ${rating_id}  at rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'rating_id', `${err.message}`)                                                                  
        }
    }

    async delete(rating_id) {        
        try{
            const deleted_rating = await db.query(`DELETE FROM rating
            WHERE id = $1 RETURNING *;`, [ rating_id])
            return deleted_rating
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with rating_id = ${rating_id}  at rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'rating_id', `${err.message}`)                                                                 
        }
    }
   
    async connectToFeedback(rating_id, message_id) {
        try{
            const get_ratings = await db.query(`INSERT INTO ratingwithfeedbacks 
            (rating_id, message_id) VALUES ($1, $2) RETURNING * ;`, [rating_id, message_id])       
            console.log(get_ratings.rows)
            return get_ratings
        } catch (err) {                                       
            console.log(err, `-----> err  in connectToFeedback function with rating_id = ${rating_id}  at rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'rating_id', `${err.message}`)                                                                  
        }   
    } 

    async isUniqeuRatingAndMessage(rating_id, message_id) {
        try{
            const get_ratings = await db.query(`SELECT EXISTS (SELECT 1
                FROM ratingwithfeedbacks WHERE rating_id = '${rating_id}' AND message_id = '${message_id}') AS "exists"`)       
            console.log(get_ratings.rows, ' ---> isUniqeuRatingAndMessage')
            return get_ratings
        } catch (err) {                                       
            console.log(err, `-----> err  in connectToFeedback function with rating_id = ${rating_id}  at rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'message_id', `${err.message}`)                                                                  
        }   
    } 
    

    async isExist(rating_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM rating WHERE id = ${rating_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist. rows ,`----> is_exist. rows in isExist function with rating_id = ${rating_id}  at  rating_model.js`)

            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with rating_id = ${rating_id}  at  rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'rating_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(provider_id, user_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM rating WHERE provider_id = '${provider_id}' AND user_id = '${user_id}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows ,`----> is_unique.rows in isExist function with provider_id = ${provider_id}  at  rating_model.js`)
            
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with provider_id = ${provider_id}  in rating_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'provider_id', `${err.message}`)                                                                
        }
    }
}

const ratingmodel = new RatingModel();
export { ratingmodel };