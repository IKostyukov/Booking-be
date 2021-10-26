import { pool } from '../db.js';
const db = pool

class FareModel {

   //  ###  Тарификация (fares)  ###

   async createNewFare (equipment_recipientofservices_id, duration, time_unit, fare) {
    console.log(equipment_recipientofservices_id, fare) 
    const new_fare = await db.query(`INSERT INTO fares(
        equipment_recipientofservices_id, duration, time_unit, fare)
        VALUES ($1, $2, $3, $4)
    RETURNING *;`, [equipment_recipientofservices_id, duration, time_unit, fare])
    return new_fare
   }

   async updateNewFare (equipment_recipientofservices_id, duration, time_unit, fare) {
    console.log(equipment_recipientofservices_id, fare) 
    const new_fare = await db.query(`UPDATE fares
	SET  fare=$1  equipment_recipientofservices_id=$2  duration=$3 time_unit=$4
	WHERE  id = $5
    RETURNING *;`, [fare, equipment_recipientofservices_id, duration, time_unit, id])
    return new_fare
   }
   
   async deleteOneFare(fare_id) {
    console.log(fare_id) 
    const deleted_fare = await db.query(`DELETE FROM  fares
	WHERE  id = $1
    RETURNING *;`, [fare_id])
    return deleted_fare
   }

}

const faremodel = new FareModel();
export { faremodel };
