import { feedbackmodel } from '../models/feedback_model.js';

class FeedbackController {

    async createFeedback(req, res) {
        const {provider_id, messagethread_id} = req.body
        const new_feedback = await feedbackmodel.create(provider_id, messagethread_id)
        if (new_feedback.rows[0]) {
            const result = { success: "Feedback successfully created" }
            res.json(result)
            console.log(new_feedback.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateFeedback(req, res) {
        const feedback_id = req.params.feedbackId
        const {provider_id, messagethread_id} = req.body
                const updated_feedback = await feedbackmodel.update(feedback_id, provider_id, messagethread_id)
        if (updated_feedback.rows[0]) {
            const result = { success: "Feedback successfully updated" }
            res.json(result)
            console.log(updated_feedback.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateFeedback(req, res) {
        const feedback_id = req.params.feedbackId
        const {is_active} = req.body
        const activated_feedback = await feedbackmodel.activate(feedback_id, is_active)
        if (activated_feedback.rows[0].is_active == true) {
            const result = { success: "Feedback successfully activated" }
            res.json(result)
            console.log(activated_feedback.rows[0], result)
        } else if (activated_feedback.rows[0].is_active == false) {
            const result = { success: "Feedback successfully deactivated" }
            res.json(result)
            console.log(activated_feedback.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteFeedback(req, res) {
        const feedback_id = req.params.feedbackId
        const deleted_feedback = await feedbackmodel.delete(feedback_id)
        if (deleted_feedback.rows.length !== 0) {
            const success = { success: "Feedback successfully deleted" }
            res.json(success)
            console.log( deleted_feedback.rows, "Successfully deleted!")
        } else if (deleted_feedback.rows.length == 0) {
            const success = { Error: "Feedback not found" }
            res.json(success) 
        }else {
            const success = { Error: "Error" }
            res.json(success)
        }
    }

    async getFeedbacks(req, res) {
        const {provider_id} = req.body
            console.log(provider_id, "provider_id")
        const get_feedbacks = await feedbackmodel.getManyFeedbacks(provider_id)
        res.json(get_feedbacks.rows)
    }
   
    
}

const feedback_controller = new FeedbackController();
export { feedback_controller }