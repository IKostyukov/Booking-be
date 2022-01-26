import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

const db = pool

class FavoriteEquipmentModel {

    async isUniqueCombination(user_id, equipment_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM favorite_equipmentproviders WHERE user_id = '${user_id}' AND equipmentprovider_id = '${equipment_id}') AS "exists";`

            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, ' -----> is_unique.rows in  isUniqueCombination function from favoriteequipment_model.js')
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUniqueCombination function with equipment_id = ${equipment_id}  in favoriteequipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'user_id, equipment_id', `${err.message}`)                                                                
        }
    }
    
    async AddFavorite (equipmentprovider_id, user_id) {        
        try{
            const new_favoriteequipment = await db.query(`INSERT INTO favorite_equipmentproviders 
            (equipmentprovider_id, user_id) VALUES ($1, $2) RETURNING *;`, [equipmentprovider_id, user_id])
            return new_favoriteequipment
        } catch (err) {                                       
            console.log(err, `-----> err in AddFavorite function with user_id = ${user_id}  at favoriteequipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'AddFavorite equipment', `${err.message}`)                                                                  
        }
    }

    async deleteFavorite(equipmentprovider_id, user_id) {
        try{
            const deleted_favoriteequipment = await db.query(`DELETE FROM favorite_equipmentproviders 
            WHERE equipmentprovider_id = $1 AND user_id = $2
            RETURNING *;`, [equipmentprovider_id, user_id])
            return deleted_favoriteequipment
        } catch (err) {                                       
            console.log(err, `-----> err in create deleteFavorite with user_id = ${user_id}  at favoriteequipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'deleteFavorite equipment', `${err.message}`)                                                                  
        }
    }

    async getFavorite(user_id) {     
        try{
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
        } catch (err) {                                       
            console.log(err, `-----> err in getFavorite function with user_id = ${user_id}  at favoriteequipment_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'getFavorite equipment', `${err.message}`)                                                                  
        }
    }
}

const favoriteequipment_model = new FavoriteEquipmentModel();
export {favoriteequipment_model};
