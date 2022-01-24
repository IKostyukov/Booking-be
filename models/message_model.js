import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class MessageModel {

    async create(user_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id) {
        try{
            const messages_id = await db.query(`SELECT id AS message_id FROM messages ORDER BY id;`)   // Проверуку убрать в контороллер в валидациию
            let list_message_id = []
            messages_id.rows.forEach(element => {
                list_message_id.push(element.message_id) 
                });

            // console.log(parent_message_id == list_message_id[30])
            if (parent_message_id < list_message_id.length && parent_message_id in list_message_id) {   // Проверуку убрать в контороллер в валидациию
                const new_message = await db.query(`INSERT INTO messages 
                (user_id, messagethread_id, content, parent_message_id, expiry_date,
                next_remind_date, reminder_frequency_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;`, [user_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id])
                const message_id = new_message.rows[0].id
                console.log(message_id,"message_id")

                const list_recipient_id = await db.query(`SELECT user_id 
                FROM users_messagethreads WHERE messagethread_id = ${messagethread_id}`)

                // const roles_arr = Array.from(roles.split(','), Number)
                console.log(list_recipient_id.rows, typeof(list_recipient_id.rows[0].user_id))

                let sql_query = " "

                for (let i = 0; i < list_recipient_id.rows.length; i += 1) {
                    sql_query += `INSERT INTO message_recipients (user_id, message_id) 
                    VALUES (${list_recipient_id.rows[i].user_id}, ${message_id}) RETURNING *;`
                }
                console.log(sql_query)
                const new_recipients = await db.query(sql_query)
                return {message: new_message, recipients: new_recipients}
            } else {      // Проверуку убрать в контороллер в валидациию
                console.log("Error, incorrect parent_message_id")
                return Error
            }
        } catch (err) {                                       
            console.log(err, `-----> err in create function with activity_name = ${activity_name}  at message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'create message', `${err.message}`)                                                                  
        }
    }

    
    async update (message_id, messagethread_id, content, parent_message_id, expiry_date, is_reminder, next_remind_date, reminder_frequency_id, mtime) {
        try{
            const updated_message = await db.query(`UPDATE messages
            SET messagethread_id=$2, content=$3, parent_message_id=$4, expiry_date=$5,
            next_remind_date=$6, reminder_frequency_id=$7, is_reminder = $8, mtime = $9
            WHERE id = $1
            RETURNING *;`, [message_id, messagethread_id, content, parent_message_id, expiry_date, next_remind_date, reminder_frequency_id, is_reminder, mtime])
            return updated_message
        } catch (err) {                                       
            console.log(err, `-----> err in update function with message_id = ${message_id}  at message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'message_id', `${err.message}`)                                                                  
        }
    }


    async activate(message_id, is_reminder) {
        try{   
            const activated_message = await db.query(`UPDATE messages
            SET is_reminder = $2
            WHERE id = $1
            RETURNING *;`, [ message_id, is_reminder])
            //console.log(activated_message.rows)
            return activated_message
        } catch (err) {                                       
            console.log(err, `-----> err in activate function with message_id = ${message_id}  at message_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'message_id', `${err.message}`)                                                                  
        }
    }

    async delete(message_id) {        
        try{   
            const deleted_message = await db.query(`DELETE FROM messages 
            WHERE id = $1 RETURNING *;`, [ message_id])
            return deleted_message
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with message_id = ${message_id}  at message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'message_id', `${err.message}`)                                                                 
        }
    }

   
    async getManyMessages(messagethread_id) {
        try {
            const get_messages = await db.query(`SELECT * FROM messages 
            WHERE messagethread_id = ${messagethread_id} ;`)       
            console.log(get_messages.rows)
            return get_messages
        } catch (err) {                                       
            console.log(err, `-----> err  in getAll function with messagethread_id = ${messagethread_id}  at message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                  
        }     
    } 

    async getManyThreads(user_id) {        
        try {
            const get_threads = await db.query(`SELECT * 
            FROM users_messagethreads 
            WHERE user_id = ${user_id};`)
            // console.log(get_threads.rows)
            return get_threads
        } catch (err) {                                       
            console.log(err, `-----> err  in getAll function with user_id = ${user_id}  at message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'user_id', `${err.message}`)                                                                  
        }     
    }

    async isExist(message_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM messages WHERE id = ${message_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist. rows ,`----> is_exist. rows in isExist function with message_id = ${message_id}  at  message_model.js`)

            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with message_id = ${message_id}  at  message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'rating_id', `${err.message}`)                                                                  
        }
    }

    async isExistReminderFrequency(reminder_frequency_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM reminder_frequency WHERE id = ${reminder_frequency_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist. rows ,`----> is_exist. rows in isExistReminderFrequency function with reminder_frequency_id = ${reminder_frequency_id}  at  message_model.js`)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExistReminderFrequency function with message_id = ${message_id}  at  message_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'reminder_frequency_id', `${err.message}`)                                                                  
        }
    }
}

const messagemodel = new MessageModel();
export { messagemodel };