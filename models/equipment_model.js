import { pool } from '../db.js';
const db = pool

class EquipmentModel {


    async create (equipment_name, equipment_id,  capacity) {
        // const equipment_obj = await db.query(`SELECT id FROM activities WHERE equipment_name = '${equipment_name}'`);
        // const equipment_id = equipment_obj.rows[0].id
        console.log(equipment_name, equipment_id, capacity) 
        const new_equipment = await db.query(`INSERT INTO equipments 
        (equipment_name, equipment_id, capacity) 
        VALUES ($1, $2, $3) 
        RETURNING *;`, [equipment_name, equipment_id, capacity])
        return new_equipment
    }


    async update (req, res) {
        const {equipment_id, equipment_name, capacity  } = req.body
        console.log(equipment_name, equipment_id, capacity)
        //  Нужно проверку на получение результатов от БД.  Вариант  - нет такого инвентаря
        const updated_equipment = await db.query(`UPDATE equipments
        SET equipment_name = $1, capacity = $2 WHERE equipments.id = $3 RETURNING *;`,
        [equipment_name, capacity, equipment_id])
        return updated_equipment
    }

    async activate(req, res) {
        const {equipment_id, active} = req.body
        console.log(equipment_id, active)
        const activated_equipment = await db.query(`UPDATE equipments
        SET active = $1 WHERE id = $2 RETURNING *;`,
        [active, equipment_id])
        return  activated_equipment
    }

    async delete(req, res) {
        const { equipment_id } = req.body
        const deleted_equipment = await db.query(`DELETE FROM equipments WHERE id = $1
        RETURNING *;`, [equipment_id])
        return deleted_equipment
    }

    async getOne(req, res) {
        const { equipment_id } = req.body
        const sql_query = `SELECT id AS equipment_id, equipment_name 
        FROM equipments WHERE id = ${equipment_id};`
        const one_equipment = await db.query(sql_query)
        return one_equipment
    }

    async getAll(req, res) {
        const { equipment_name } = req.body    
        const sql_query = `SELECT id AS equipment_id, equipment_name 
        FROM equipments WHERE equipment_name LIKE '%'||'${equipment_name}'||'%';`
        const all_equipments = await db.query(sql_query)
        return all_equipments
    }

   


    // 1 location: String,
    // 2 acitvity_name: String,
    // 3 date_start: Int,
    // 4 date_end: Int,
    // 5 time_start: Int,
    // 6 time_end: Int,
    // 7 capacity: Int,
    // 8 price_start: Int,
    // 9 price_end: Int,
    // 10 max_distance_from_center: Int,
    // 11 services: [Int],
    // 12 equipment_id: [Int],
    // 13 short: Boolean

    async getSearch(req, res) {

        const { 
            location,
            acitvity_name,
            date_start,
            date_end,
            time_start,
            time_end,
            capacity,
            price_start,
            price_end,
            max_distance_from_center,
            services,
            equipment_id,
            short
        } = req.body
        console.log(typeof(price_start))
        const sql_begining_query = `SELECT  r.id, recipientofservices_name, 
        location, address, distance_from_center as to_center, rating, 
        (SELECT COUNT(f.id) as feedbacks FROM feedbacks f
        WHERE r.id = f.recipientofservices_id), 
        eq.id as equipment_id, eqr.id as eqr_id, eq.equipment_name,  eqr.quantity,
        eqr.quantity - (SELECT  COUNT(bk.equipment_recipientofservices_id) as taken   FROM bookings bk 
            WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
            (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
            AND  bk.equipment_recipientofservices_id = eqr.id)  as avaliable, 
        MIN(fs.fare) as start_price
        FROM recipientofservices r
        LEFT JOIN services_recipientofservices s_r 
                ON r.id = s_r.recipientofservices_id  
        LEFT JOIN equipments_recipientofservices eqr 
            ON  r.id = eqr.recipientofservices_id 
        LEFT JOIN equipments eq  
            ON eqr.equipment_id = eq.id
        LEFT JOIN fares fs
            ON eqr.id = fs.equipment_recipientofservices_id
        WHERE 
        distance_from_center < ${max_distance_from_center}
        AND location != '${location}' AND eq.id in (${equipment_id})
        AND fs.fare = (SELECT MIN(f.fare) FROM fares f 
            WHERE f.equipment_recipientofservices_id = eqr.id  AND f.fare >= ${price_start}  AND f.fare <= ${price_end})
        AND eqr.id  not in
            (SELECT bk.equipment_recipientofservices_id FROM bookings bk 
            WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
            (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
            AND  bk.equipment_recipientofservices_id = eqr.id
            AND eqr.quantity <
                (SELECT  COUNT(bk.equipment_recipientofservices_id)   FROM bookings bk 
                WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
                (DATE '${date_start}' + TIME '${time_start}', DATE '${date_end}' + TIME '${time_end}')
                AND  bk.equipment_recipientofservices_id = eqr.id) 
            )`;

        const sql_services_query = ` AND s_r.service_id  in (${services}) `;
        const sql_ending_query = ` GROUP BY r.id, eq.id, eq.equipment_name, eqr.id, eqr.quantity;`;
        let sql_query = ``        
        if ( services == undefined) {
            sql_query = sql_begining_query + sql_ending_query;
        } else {
            sql_query = sql_begining_query + sql_services_query + sql_ending_query;
        }

        const get_equipments = await db.query(sql_query)

        // [ acitvity_name, capacity, price_start, price_end, short]
        // console.log(sql_query)
        
        console.log(get_equipments)
        return get_equipments
    }
}

const equipmentmodel = new EquipmentModel();
export { equipmentmodel };