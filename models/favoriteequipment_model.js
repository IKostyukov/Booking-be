import { pool } from '../db.js';
const db = pool

class FavoriteEquipmentModel {
    
    async AddFavorite (equipmentprovider_id, user_id) {        
        const new_favoriteequipment = await db.query(`INSERT INTO favorite_equipmentproviders 
        (equipmentprovider_id, user_id) VALUES ($1, $2) RETURNING *;`, [equipmentprovider_id, user_id])
        return new_favoriteequipment
    }

    async deleteFavorite(equipmentprovider_id, user_id) {
        const deleted_favoriteequipment = await db.query(`DELETE FROM favorite_equipmentproviders 
        WHERE equipmentprovider_id = $1 AND user_id = $2
        RETURNING *;`, [equipmentprovider_id, user_id])
        return deleted_favoriteequipment
    }

    async getFavorite(user_id) {     
        const sql_query = `SELECT fav.user_id, e.equipment_name, p.provider_name, f.fare 
        FROM favorite_equipmentproviders fav 
        LEFT JOIN fares f 
        ON f.equipmentprovider_id = fav.equipmentprovider_id
        LEFT JOIN equipmentsproviders ep
        ON ep.id = fav.equipmentprovider_id
        LEFT JOIN equipments e
        ON e.id = ep.equipment_id
        LEFT JOIN providers p
        ON p.id = ep.provider_id        
        WHERE fav.user_id = ${user_id}
        AND f.fare = (SELECT MIN(f.fare) 
                        FROM fares f 
                        WHERE f.equipmentprovider_id = fav.equipmentprovider_id);`
        const favoriteequipment = await db.query(sql_query)
        return favoriteequipment
    }

}

const favoriteequipment_model = new FavoriteEquipmentModel();
export {favoriteequipment_model};
