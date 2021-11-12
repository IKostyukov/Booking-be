import { ratingmodel } from '../models/rating_model.js';

class RatingController {

    async addRate(req, res) {
        const {provider_id, user_id, clearness, staff, view } = req.body
        const new_rating = await ratingmodel.add(provider_id, user_id, clearness, staff, view )
        if (new_rating.rows[0]) {
            const result = { success: "Rate successfully added" }
            res.json(result)
            console.log(new_rating.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateRate(req, res) {
        const rating_id = req.params.ratingId
        const {provider_id, user_id, clearness, staff, view } = req.body
        const updated_rating = await ratingmodel.update(rating_id, provider_id, user_id, clearness, staff, view )
        if (updated_rating.rows[0]) {
            const result = { success: "Rating successfully updated" }
            res.json(result)
            console.log(updated_rating.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }    

    async deleteRate(req, res) {
        const rating_id = req.params.ratingId
        const deleted_rating = await ratingmodel.delete(rating_id)
        if (deleted_rating.rows.length !== 0) {
            const success = { success: "Rating successfully deleted" }
            res.json(success)
            console.log( deleted_rating.rows, "Successfully deleted!")
        } else if (deleted_rating.rows.length == 0) {
            const success = { Error: "Rating not found" }
            res.json(success) 
        }else {
            const success = { Error: "Error" }
            res.json(success)
        }
    }

    async connectRatingToFeedback(req, res) {
        const rating_id = req.params.ratingId
        const message_id = req.params.messageId
        console.log(message_id, "provider_id")
        const connected_rating = await ratingmodel.connectToFeedback(rating_id, message_id)
        if (connected_rating.rows[0]) {
            const result = { success: "Rating successfully connected with feedback" }
            res.json(result)
            console.log(connected_rating.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
        res.json(get_ratings.rows)
    }
   
    
}

const rating_controller = new RatingController();
export { rating_controller }