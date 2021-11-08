import { pool } from '../db.js';
const db = pool

class AdvantageModel {

    async create(advantage_name, icon) {
        
        // const roles_id = Array.from(roles.split(','), Number)
        const new_advantage = await db.query(`INSERT INTO advantages (advantage_name, icon)
        VALUES ($1, $2)
        RETURNING *;`, [advantage_name, icon])

        return new_advantage
    }

    async update(advantage_id, advantage_name, icon) {       
        const updated_advantage = await db.query(`UPDATE advantages
        SET advantage_name=$2, icon=$3
        WHERE id = $1
        RETURNING *;`, [advantage_id, advantage_name, icon])
        console.log(updated_advantage.rows) 
        return updated_advantage
    }


    async activate(advantage_id, active) {
                const activated_advantage = await db.query(`UPDATE advantages
        SET is_active = $2
        WHERE id = $1
        RETURNING *;`, [ advantage_id, active])
        //console.log(activated_advantage.rows)
        return activated_advantage
    }

    async delete(advantage_id) {
        const deleted_advantage = await db.query(`DELETE FROM advantages 
        WHERE id = $1 RETURNING *;`, [ advantage_id])
        return deleted_advantage
    }

    async getOne(advantage_id) {
        const get_advantage = await db.query(`SELECT id AS advantage_id, advantage_name, icon, is_active
        FROM advantages WHERE advantages.id = ${advantage_id};`)
        console.log(get_advantage.rows)        
       return get_advantage
    }

    async getMany(advantage_name) {
        const get_advantages = await db.query(`SELECT  id AS advantage_id, advantage_name, icon, is_active
        FROM advantages 
        WHERE advantage_name LIKE '%'||$1||'%';`, [advantage_name])       
        // console.log(get_advantages.rows)
        return get_advantages
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