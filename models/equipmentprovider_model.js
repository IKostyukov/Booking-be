import { pool } from '../db.js';
const db = pool

class EquipmentProviderModel {

   // ####  Инвентарь от объект отдыха  (equipmentsproviders) ###

   async isExist(equipment_id) {
    const sql_query = `SELECT EXISTS (SELECT 1
    FROM equipmentsproviders WHERE id = ${equipment_id}) AS "exists";`
    try{
        const is_exist = await db.query(sql_query)
        console.log(is_exist. rows ,`----> is_exist. rows in isExist function with equipment_id = ${equipment_id}  at  equipmentprovider_model.js`)

        return  is_exist
    } catch (err) {                                       
        console.log(err, `-----> err in isExist function with message_id = ${message_id}  at  equipmentprovider_model.js`)
        // console.log(err.message, '-----> err.message')                                                                  
        throw new Api500Error( 'rating_id', `${err.message}`)                                                                  
    }
}

   async createNewEquipmentProvider (provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable) {
        console.log(provider_id, equipment_id) 
        const new_equipmentprovider = await db.query(`INSERT INTO equipmentsproviders(
            provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`, [provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable])
        return new_equipmentprovider
    }

    async updateOneEquipmentProvider (provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable) {
        console.log(provider_id, equipment_id) 
        const updated_equipmentprovider = await db.query(`UPDATE equipmentsproviders
            SET  equipment_id=$2, quantity=$3, availabilitydate=$4, cancellationdate=$5, discountnonrefundable=$6
            WHERE provider_id = $1
            RETURNING *;`, [provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable])
        // console.log(updated_equipmentprovider)
        return updated_equipmentprovider
    }

    
    async activateOneEquipmentProvider(equipmentprovider_id, active) {
        const activated_equipmentprovider = await db.query(`UPDATE equipmentsproviders
        SET active = $2 WHERE id = $1 RETURNING *;`,
        [ equipmentprovider_id, active])
        return  activated_equipmentprovider
    }

    async deleteOneEquipmentProvider(equipmentprovider_id) {
        const activated_equipmentprovider = await db.query(`DELETE FROM equipmentsproviders
        WHERE id = $1 RETURNING *;`,[equipmentprovider_id])
        return  activated_equipmentprovider
    }

    async getOneEquipmentOfProvider(equipmentprovider_id) {
        const one_equipmentprovider = await db.query(`SELECT id as equipmentprovider_id, active, provider_id, equipment_id, quantity,  availabilitydate, cancellationdate, discountnonrefundable
        FROM equipmentsproviders
        WHERE id = ${equipmentprovider_id};`)
        return one_equipmentprovider
    }

    async getAllEquipmentOfProvider(provider_id) {
        const all_equipmentprovider = await db.query(`SELECT id as equipmentprovider_id, active, provider_id, equipment_id, quantity,  availabilitydate, cancellationdate, discountnonrefundable
        FROM equipmentsproviders
        WHERE provider_id = ${provider_id};`)
        return all_equipmentprovider
    }

    async isExist(equipmentprovider_id) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipmentsproviders WHERE id = ${equipmentprovider_id}) AS "exists";`
        try{
            const is_exist = await db.query(sql_query)
            console.log(is_exist)
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with equipmentprovider_id = ${equipmentprovider_id}  at  activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'equipmentprovider_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(equipment_name) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM equipments WHERE equipment_name = '${equipment_name}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique)
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isExist function with equipment_name = ${equipment_name}  in activiy_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'equipment_name', `${err.message}`)                                                                
        }
    }
    
    

    
}

const equipmentprovidermodel = new EquipmentProviderModel();
export { equipmentprovidermodel };


