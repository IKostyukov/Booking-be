import { pool } from '../db.js';
const db = pool

class Facilities {

    async getBest(req, res) {
        const best_facilities = await db.query(`SELECT 
        r.id, recreationalfacility_name, 
        location, address, distance_from_center, rating, 
        COUNT(f.id) as feedbacks  
        FROM recreationalfacilities r 
        INNER  JOIN feedbacks f
            ON  r.id = f.recreationalfacility_id 
        WHERE rating > 90  
        GROUP BY r.id;`)
        return best_facilities
    }
}

const facilities = new Facilities()
export { facilities }