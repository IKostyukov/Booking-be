import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class FeedbackModel {

    async create(provider_id, messagethread_id) {
        try {
            const new_feedback = await db.query(`INSERT INTO feedbacks 
            (provider_id, messagethread_id) 
            VALUES ($1, $2)
            RETURNING *;`, [provider_id, messagethread_id])        
            return  new_feedback  
        } catch (err) {                                       
            console.log(err, `-----> err in create function with provider_id = ${provider_id}  at feedback_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'feedback', `${err.message}`)                                                                  
        }  
    }
        
    async update (feedback_id, provider_id, messagethread_id) {
        try {
            const updated_feedback = await db.query(`UPDATE feedbacks
            SET provider_id=$2, messagethread_id=$3
            WHERE id = $1
            RETURNING *;`, [feedback_id, provider_id, messagethread_id])
            return updated_feedback
        } catch (err) {                                       
            console.log(err, `-----> err in update function with feedback_id = ${feedback_id}  at feedback_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'feedback_id', `${err.message}`)                                                                  
        }
    }


    async activate(feedback_id, is_active) {
        try {
            const activated_feedback = await db.query(`UPDATE feedbacks
            SET is_active = $2
            WHERE id = $1
            RETURNING *;`, [ feedback_id, is_active])
            //console.log(activated_feedback.rows)
            return activated_feedback
        } catch (err) {                                       
            console.log(err, `-----> err in activate function with feedback_id = ${feedback_id}  at feedback_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'feedback_id', `${err.message}`)                                                                  
        }
    }

    async delete(feedback_id) {        
        try {
            const deleted_feedback = await db.query(`DELETE FROM feedbacks 
            WHERE id = $1 RETURNING *;`, [ feedback_id])
            return deleted_feedback
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with feedback_id = ${feedback_id}  at feedback_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'feedback_id', `${err.message}`)                                                                 
        }
    }

   
    async getMany(provider_id) {
        try {
            const get_feedbacks = await db.query(`SELECT * FROM feedbacks 
            WHERE provider_id = ${provider_id} ;`)       
            console.log(get_feedbacks.rows)
            return get_feedbacks
        } catch (err) {                                       
            console.log(err, `-----> err  in getAll function with provider_id = ${provider_id}  at feedback_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'provider_id', `${err.message}`)                                                                  
        }  
    }
    async isExist(feedback_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM feedbacks WHERE id = ${feedback_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, '----> is_exist.rows in isExist function with feedback_id = ${feedback_id}  at  feedback_model.js ')
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with feedback_id = ${feedback_id}  at  feedback_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'feedback_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(provider_id, messagethread_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM feedbacks WHERE provider_id = '${provider_id}' AND messagethread_id = '${messagethread_id}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, `----> is_unique.rows in isUnique function with messagethread_id = ${messagethread_id}  in feedback_model.js`)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with messagethread_id = ${messagethread_id}  in feedback_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                
        }
    } 


}

const feedbackmodel = new FeedbackModel();
export { feedbackmodel };