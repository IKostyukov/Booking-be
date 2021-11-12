import { messagemodel } from '../models/message_model.js';

class MessageController {

    async createMessage(req, res) {
        const {user_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id } = req.body
        const new_message = await messagemodel.create(user_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id)
        // {message: new_message, recipients: new_recipients}
        if (new_message.message.rows[0] && new_message.recipients[0].rows[0]) {
            const result = { success: "Message successfully created" }
            res.json(result)
            console.log(new_message.message.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateMessage(req, res) {
        const message_id = req.params.messageId
        const {messagethread_id, content, parent_message_id, expiry_date, is_reminder, next_remind_date, reminder_frequency_id, mtime = "NOW()"} = req.body
        const updated_message = await messagemodel.update(message_id, messagethread_id, content, parent_message_id, expiry_date, is_reminder, next_remind_date, reminder_frequency_id, mtime)
        if (updated_message.rows[0]) {
            const result = { success: "Message successfully updated" }
            res.json(result)
            console.log(updated_message.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateMessage(req, res) {
        const message_id = req.params.messageId
        const {is_reminder} = req.body
        const activated_message = await messagemodel.activate(message_id, is_reminder)
        if (activated_message.rows[0].is_reminder == true) {
            const result = { success: "Message successfully activated" }
            res.json(result)
            console.log(activated_message.rows[0], result)
        } else if (activated_message.rows[0].is_reminder == false) {
            const result = { success: "Message successfully deactivated" }
            res.json(result)
            console.log(activated_message.rows[0], result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteMessage(req, res) {
        const message_id = req.params.messageId
        const deleted_message = await messagemodel.delete(message_id)
        if (deleted_message.rows.length !== 0) {
            const success = { success: "Message successfully deleted" }
            res.json(success)
            console.log( deleted_message.rows, "Successfully deleted!")
        } else if (deleted_message.rows.length == 0) {
            const success = { Error: "Message not found" }
            res.json(success) 
        }else {
            const success = { Error: "Error" }
            res.json(success)
        }
    }

    async getMessages(req, res) {
        const {messagethread_id} = req.body
            console.log(messagethread_id, "messagethread_id")
        const get_messages = await messagemodel.getManyMessages(messagethread_id)
        res.json(get_messages.rows)
    }
   
    async getThreads(req, res) {
        const {user_id} = req.body
            console.log(user_id, "user_id")
        const get_messagethreads = await messagemodel.getManyThreads(user_id)
        res.json(get_messagethreads.rows)
    }
}

const message_controller = new MessageController();
export { message_controller }