import { pool } from "../db.js";
const db = pool

class PromotionModel {

      // ### Экстрадаты ###

    async createNewPromotion (equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end ) {
        console.log({equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end} ) 
        const new_promotion = await db.query(`INSERT INTO promotions_equipment(
            equipmentprovider_id, title, discount,
            booking_start, booking_end, activity_start, activity_end)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`, [equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end ])
        return new_promotion
    }
    
    async updateNewPromotion (promotions_id, equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end ) {
        console.log({promotions_id, equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end} ) 
        const updated_promotion = await db.query(`
        UPDATE promotions_equipment
        SET equipmentprovider_id=$1, title=$2, discount=$3,
        booking_start=$4, booking_end=$5, activity_start=$6, activity_end=$7
        WHERE id = $8
        RETURNING *;`, [equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end, promotions_id])
        return updated_promotion
    }

    async activateOnePromotion (promotion_id, is_active) {
        console.log(promotion_id ) 
        const activated_promotion = await db.query(`UPDATE promotions_equipment
        SET is_active=$2
        WHERE id = $1
        RETURNING *;`, [promotion_id, is_active])
        return activated_promotion
    }

    async deleteOnePromotion(promotion_id) {
        console.log(promotion_id) 
        const deleted_promotion = await db.query(`DELETE FROM promotions_equipment
        WHERE id = $1
        RETURNING *;`, [promotion_id])
        return deleted_promotion
    }


    async getOnePromotionOfProvider(promotion_id) {
        console.log(promotion_id) 
        const one_promotion = await db.query(`SELECT id AS promotion_id,
        equipmentprovider_id, title, discount, booking_start, booking_end,
        activity_start, activity_end
	    FROM promotions_equipment
        WHERE id = ${promotion_id};`)
        return one_promotion
    }

    async getAllPromotionsOfProvider(equipmentprovider_id) {
        console.log(equipmentprovider_id) 
        const sql = `SELECT id AS promotion_id,
        equipmentprovider_id, title, discount, booking_start, booking_end,
        activity_start, activity_end
	    FROM promotions_equipment
        WHERE equipmentprovider_id = ${equipmentprovider_id};`
        console.log(sql) 
        const all_promotions = await db.query(sql)
        return all_promotions
    }
}

const promotionmodel = new PromotionModel();
export { promotionmodel };
