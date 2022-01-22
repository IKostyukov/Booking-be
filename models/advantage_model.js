import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class AdvantageModel {

    async create(advantage_name, icon) {
        try {        
            // const roles_id = Array.from(roles.split(','), Number)
            const new_advantage = await db.query(`INSERT INTO advantages (advantage_name, icon)
            VALUES ($1, $2)
            RETURNING *;`, [advantage_name, icon])
            return new_advantage
        } catch (err) {                                       
            console.log(err, `-----> err in create function with advantage_name = ${advantage_name}  at advantage_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'advantage_name', `${err.message}`)                                                                  
        }
    }

    async update(advantage_id, advantage_name, icon) {       
        try {
            const updated_advantage = await db.query(`UPDATE advantages
            SET advantage_name=$2, icon=$3
            WHERE id = $1
            RETURNING *;`, [advantage_id, advantage_name, icon])
            console.log(updated_advantage.rows) 
            return updated_advantage
        } catch (err) {                                       
            console.log(err, `-----> err in update function with advantage_id = ${advantage_id}  at advantage_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'advantage_id', `${err.message}`)                                                                  
        }
    }


    async activate(advantage_id, is_active) {
        try {
            const activated_advantage = await db.query(`UPDATE advantages
            SET is_active = $2
            WHERE id = $1
            RETURNING *;`, [ advantage_id, is_active])
            //console.log(activated_advantage.rows)
            return activated_advantage
        } catch (err) {                                       
            console.log(err, `-----> err in activate function with advantage_id = ${advantage_id}  at advantage_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error( 'advantage_id', `${err.message}`)                                                                  
        }
    }

    async delete(advantage_id) {
        try {
            const deleted_advantage = await db.query(`DELETE FROM advantages 
            WHERE id = $1 RETURNING *;`, [ advantage_id])
            return deleted_advantage
        } catch (err) {                                       
            console.log(err, `-----> error  in delete function with advantage_id = ${advantage_id}  at advantage_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'advantage_id', `${err.message}`)                                                                 
        }
    }

    async getOne(advantage_id) {
        try {
            const get_advantage = await db.query(`SELECT id AS advantage_id, advantage_name, icon, is_active
            FROM advantages WHERE advantages.id = ${advantage_id};`)
            console.log(get_advantage.rows)        
            return get_advantage
        } catch (err) {                                       
            console.log(err, `-----> err  in getOne function with advantage_id = ${advantage_id}  at advantage_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'advantage_id', `${err.message}`)                                                                  
        }    
    }

    async getMany(advantage_name) {
        try {
            const get_advantages = await db.query(`SELECT  id AS advantage_id, advantage_name, icon, is_active
            FROM advantages 
            WHERE advantage_name LIKE '%'||$1||'%';`, [advantage_name])       
            // console.log(get_advantages.rows)
            return get_advantages
        } catch (err) {                                       
            console.log(err, `-----> err  in getMany function with advantage_name = ${advantage_name}  at advantage_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'advantage_name', `${err.message}`)                                                                  
        } 
    }
    
    async isExist(advantage_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM advantages WHERE id = ${advantage_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with advantage_id = ${advantage_id}  at  activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'advantage_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(advantage_name) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM advantages WHERE advantage_name = '${advantage_name}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with advantage_name = ${advantage_name}  in activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'advantage_name', `${err.message}`)                                                                
        }
    }

    async addNewAdvantageToProvider(provider_id, advantage_id)  {
        console.log(provider_id, advantage_id)

        const sql_query = `INSERT INTO advantages_providers
        (provider_id, advantage_id)
        VALUES (${provider_id}, ${advantage_id}) 
        RETURNING *;`        
        const advantage_provider = await db.query(sql_query)
        return advantage_provider
    }

    async deleteOneAdvantageFromProvider(provider_id, advantage_id)  {
        console.log(provider_id, advantage_id)
        const sql_query = `DELETE FROM advantages_providers 
        WHERE provider_id = ${provider_id} AND advantage_id = ${advantage_id}
        RETURNING *;`     
        // console.log(sql_query)   
        const deleted_advantage_provider = await db.query(sql_query)
        return deleted_advantage_provider
    }

}

const advantagemodel = new AdvantageModel();
export { advantagemodel };