import { pool } from '../db.js';
const db = pool

class FareModel {

   //  ###  Тарификация (fares)  ###

   async createNewFare (equipmentprovider_id, duration, time_unit, fare) {
    console.log(equipmentprovider_id, fare) 
    const new_fare = await db.query(`INSERT INTO fares(
        equipmentprovider_id, duration, time_unit, fare)
        VALUES ($1, $2, $3, $4)
    RETURNING *;`, [equipmentprovider_id, duration, time_unit, fare])
    return new_fare
   }

   async updateNewFare (fare_id, equipmentprovider_id, duration, time_unit, fare) {
    console.log(equipmentprovider_id, fare) 
    const new_fare = await db.query(`UPDATE fares
	SET  fare=$1,  equipmentprovider_id=$2,  duration=$3, time_unit=$4
	WHERE  id = $5
    RETURNING *;`, [fare, equipmentprovider_id, duration, time_unit, fare_id])
    return new_fare
   }
   
   async deleteOneFare(fare_id) {
    console.log(fare_id) 
    const deleted_fare = await db.query(`DELETE FROM  fares
	WHERE  id = $1
    RETURNING *;`, [fare_id])
    return deleted_fare
   }

   async getOneFare(fare_id) {
    console.log(fare_id) 
    const one_fare = await db.query(`SELECT id AS fare_id,
    equipmentprovider_id, duration, time_unit, fare
	FROM fares WHERE id = ${fare_id};`)
    return one_fare
   }


   async getAllFares(equipmentprovider_id) {
    console.log(equipmentprovider_id) 
    const all_fares = await db.query(`SELECT id AS fare_id,
    equipmentprovider_id, duration, time_unit, fare
	FROM fares WHERE equipmentprovider_id = ${equipmentprovider_id};`)
    return all_fares
   }

}

const faremodel = new FareModel();
export { faremodel };
