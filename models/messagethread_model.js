import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class MessagethreadModel {

    async create(subject, messagethreadtype) {
        try {        
            // const roles_id = Array.from(roles.split(','), Number)
            const new_messagethread = await db.query(`INSERT INTO messagethreads (subject, messagethreadtype, , ctime )
            VALUES ($1, $2, NOW())
            RETURNING *;`, [subject, messagethreadtype])
            return new_messagethread
        } catch (err) {                                       
            console.log(err, `-----> err in create function with subject = ${subject}  at messagethread_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'subject', `${err.message}`)                                                                  
        }
    }

    async update(messagethread_id, subject, messagethreadtype) {       
        try {
            const updated_messagethread = await db.query(`UPDATE messagethreads
            SET subject=$2, messagethreadtype=$3
            WHERE id = $1
            RETURNING *;`, [messagethread_id, subject, messagethreadtype])
            console.log(updated_messagethread.rows) 
            return updated_messagethread
        } catch (err) {                                       
            console.log(err, `-----> err in update function with messagethread_id = ${messagethread_id}  at messagethread_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                  
        }
    }


    async activate(messagethread_id, is_active) {
        try {
            const activated_messagethread = await db.query(`UPDATE messagethreads
            SET is_active = $2
            WHERE id = $1
            RETURNING *;`, [ messagethread_id, is_active])
            //console.log(activated_messagethread.rows)
            return activated_messagethread
        } catch (err) {                                       
            console.log(err, `-----> err in activate function with messagethread_id = ${messagethread_id}  at messagethread_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                  
        }
    }

    async delete(messagethread_id) {
        try {
            const deleted_messagethread = await db.query(`DELETE FROM messagethreads 
            WHERE id = $1 RETURNING *;`, [ messagethread_id])
            return deleted_messagethread
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with messagethread_id = ${messagethread_id}  at messagethread_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                 
        }
    }

    async getOne(messagethread_id) {
        try {
            const get_messagethread = await db.query(`SELECT id AS messagethread_id, subject, messagethreadtype, is_active
            FROM messagethreads WHERE messagethreads.id = ${messagethread_id};`)
            console.log(get_messagethread.rows)        
            return get_messagethread
        } catch (err) {                                       
            console.log(err, `-----> err  in getOne function with messagethread_id = ${messagethread_id}  at messagethread_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                  
        }    
    }

    async getMany(subject) {
        try {
            const get_messagethreads = await db.query(`SELECT  id AS messagethread_id, subject, messagethreadtype, is_active
            FROM messagethreads 
            WHERE subject LIKE '%'||$1||'%';`, [subject])       
            // console.log(get_messagethreads.rows)
            return get_messagethreads
        } catch (err) {                                       
            console.log(err, `-----> err  in getMany function with subject = ${subject}  at messagethread_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'subject', `${err.message}`)                                                                  
        } 
    }
    
    async isExist(messagethread_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM messagethreads WHERE id = ${messagethread_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with messagethread_id = ${messagethread_id}  at  activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'messagethread_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(subject) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM messagethreads WHERE subject = '${subject}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with subject = ${subject}  in activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'subject', `${err.message}`)                                                                
        }
    }
}

const messagethreadmodel = new MessagethreadModel();
export { messagethreadmodel };