import { pool } from '../db.js';
const db = pool

class EquipmentRecipientModel {

   // ####  Инвентарь от объект отдыха  (equipments_recipientofcervices) ###

   async createNewEquipmentProvider (recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable) {
        console.log(recipientofservices_id, equipment_id) 
        const new_equipment_recipient = await db.query(`INSERT INTO equipments_recipientofservices(
            recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`, [recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable])
        return new_equipment_recipient
    }

    async updateOneEquipmentProvider (recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable) {
        console.log(recipientofservices_id, equipment_id) 
        const new_equipment_provider = await db.query(`UPDATE equipments_recipientofservices
            SET  equipment_id=$2, quantity=$3, availabilitydate=$4, cancellationdate=$5, discountnonrefundable=$6
            WHERE recipientofservices_id = $1
            RETURNING *;`, [recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable])
        // console.log(new_equipment_recipient)
        return new_equipmen_provider
    }

    
    async activateOneEquipmentProvider(equipmentrecipientofservices_id, active) {
        const activated_equipmentprovider = await db.query(`UPDATE equipments_recipientofservices
        SET active = $2 WHERE id = $1 RETURNING *;`,
        [ equipmentrecipientofservices_id, active])
        return  activated_equipmentprovider
    }

    async deleteOneEquipmentProvider(recipientofservices_id, equipment_id) {
        const deleted_serviceprovider = await db.query(`DELETE FROM equipments_recipientofservices
        WHERE recipientofservices_id =$1 AND equipment_id = $2
        RETURNING *;`, [recipientofservices_id, equipment_id])
        return deleted_serviceprovider
    }
}

const equipmentrecipientmodel = new EquipmentRecipientModel();
export { equipmentrecipientmodel };


