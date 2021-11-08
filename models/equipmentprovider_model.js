import { pool } from '../db.js';
const db = pool

class EquipmentProviderModel {

   // ####  Инвентарь от объект отдыха  (equipmentsproviders) ###

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
    

    
}

const equipmentprovidermodel = new EquipmentProviderModel();
export { equipmentprovidermodel };


