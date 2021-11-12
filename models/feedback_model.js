import { pool } from '../db.js';
const db = pool

class FeedbackModel {

    async create(provider_id, messagethread_id) {
        const new_feedback = await db.query(`INSERT INTO feedbacks 
        (provider_id, messagethread_id) 
        VALUES ($1, $2)
        RETURNING *;`, [provider_id, messagethread_id])        
        return  new_feedback    
    }
        
    async update (feedback_id, provider_id, messagethread_id) {
        const updated_feedback = await db.query(`UPDATE feedbacks
        SET provider_id=$2, messagethread_id=$3
        WHERE id = $1
        RETURNING *;`, [feedback_id, provider_id, messagethread_id])
        return updated_feedback
    }


    async activate(feedback_id, is_active) {
        const activated_feedback = await db.query(`UPDATE feedbacks
        SET is_active = $2
        WHERE id = $1
        RETURNING *;`, [ feedback_id, is_active])
        //console.log(activated_feedback.rows)
        return activated_feedback
    }

    async delete(feedback_id) {        
        const deleted_feedback = await db.query(`DELETE FROM feedbacks 
        WHERE id = $1 RETURNING *;`, [ feedback_id])
        return deleted_feedback
    }

   
    async getManyFeedbacks(provider_id) {
        const get_feedbacks = await db.query(`SELECT * FROM feedbacks 
        WHERE provider_id = ${provider_id} ;`)       
        console.log(get_feedbacks.rows)
        return get_feedbacks
    } 


}

const feedbackmodel = new FeedbackModel();
export { feedbackmodel };