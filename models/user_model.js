import { pool } from '../db.js';
const db = pool

class UsersModel {

    async create(req, res) {
        const {email, phone, first_name, last_name, patronymic = null, dob, ctime = "NOW()", mtime = "NOW()", roles } = req.body
        const roles_id = Array.from(roles.split(','), Number)
        const new_user = await db.query(`INSERT INTO users 
        (email, phone, first_name, last_name, patronymic, 
        dob, ctime, mtime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`, [email, phone, first_name, last_name, patronymic, dob, ctime, mtime])
        const user_id = new_user.rows[0].id
        let sql_query = " "

        for (let i = 0; i < roles_id.length; i += 1) {
            sql_query += `INSERT INTO users_roles (user_id, role_id) 
            VALUES (${user_id}, ${roles_id[i]}) RETURNING *;`
        }
        const new_role = await db.query(sql_query)
        return {new_user: new_user, new_role: new_role}
    }

    async update(req, res) {
        const user_id = req.params.id
        const {active, email, phone, first_name, last_name, patronymic, dob, mtime = "NOW()", roles } = req.body
        const roles_arr = Array.from(roles.split(','), Number)
        //  Нужно проверку  на получение результатов от БД.  Вариант  - нет такого пользователя
        const updated_user = await db.query(`UPDATE users
        SET active=$1, email=$2, phone=$3, first_name=$4, last_name=$5, patronymic=$6, dob=$7,  mtime=$8
        WHERE id = $9
        RETURNING *;`, [active, email, phone, first_name, last_name, patronymic, dob,  mtime, user_id])
        // console.log(updated_user)
        let string_delete = `DELETE FROM users_roles WHERE user_id = ${user_id};`
        let string_update = " "
        let sql_query = " "
            for (let i = 0; i < roles_arr.length; i += 1) {    
                string_update += `INSERT INTO users_roles (user_id, role_id) 
                VALUES (${user_id}, ${roles_arr[i]}) RETURNING *;`
            }
            sql_query = string_delete + string_update
        // console.log(sql_query)
        const updated_roles = await db.query(sql_query)
        // console.log(updated_roles[1])
        return {updated_user: updated_user, updated_roles: updated_roles}
    }

    async activate(req, res) {
        const user_id = req.params.id
        const {active} = req.body
        const activated_person = await db.query(`UPDATE users
        SET active = $2
        WHERE id = $1
        RETURNING *;`, [ user_id, active])
        //console.log(activated_person.rows)
        return activated_person
    }

    async delete(req, res) {
        const user_id = req.params.id
        const deleted_person = await db.query(`DELETE FROM users 
        WHERE id = $1 RETURNING *;`, [ user_id])
        return deleted_person
    }

    async findOne(user_name, caback) { 
        // const {user_name} = req.body 
        // const {user_name} = user_name

        const sql = `SELECT id, active, email, phone, first_name, last_name, patronymic, dob 
        FROM users
        WHERE last_name = '${user_name}' LIMIT 1;`     

        console.log(sql, 'sql -test')
        const user = await db.query(sql)
        
        console.log(user.rows, 'findOne -test')
        return user
    }

    async getOneWithRoles(req, res) {
        const user_id = req.params.id        
        const get_user = await db.query(`SELECT id, active, email, phone, first_name, last_name, patronymic, dob, role_id 
        FROM users LEFT JOIN users_roles ON users.id = users_roles.user_id WHERE users.id = ${user_id};`)
        // console.log(get_user)
        let roles = []
        for (let i = 0; i < get_user.rowCount; i += 1) {
            roles.push(get_user.rows[i].role_id)
        }
        const user = {
            user_id: get_user.rows[0].id,
            active: get_user.rows[0].active,
            email: get_user.rows[0].email,
            phone: get_user.rows[0].phone,
            firstName: get_user.rows[0].first_name,
            lastName: get_user.rows[0].last_name,
            patronymic: get_user.rows[0].patronymic,
            dob: get_user.rows[0].dob,
            roles: roles
        }
       return user
    }

    async getMany(req, res) {
        const { first_name, last_name, email, phone } = req.body
        const get_users = await db.query(`SELECT  id, active, email, phone, first_name, last_name, patronymic, dob, role_id 
        FROM users LEFT JOIN users_roles ON users.id = users_roles.user_id 
        WHERE first_name LIKE '%'||$1||'%' OR last_name LIKE '%'||$2||'%' OR email LIKE '%'||$3||'%'
        OR phone LIKE '%'||$4||'%' ;`, [first_name, last_name, email, phone ])
        
        let users = []
        let roles = []
        for (let i = 0; i < get_users.rowCount; i += 1) {
            
            if (get_users.rows[i] && get_users.rows[i + 1] && get_users.rows[i].id !==  get_users.rows[i + 1].id) {
                roles.push(get_users.rows[i].role_id)
                let user = {
                    user_id: get_users.rows[i].id,
                    active: get_users.rows[i].active,
                    email: get_users.rows[i].email,
                    phone: get_users.rows[i].phone,
                    firstName: get_users.rows[i].first_name,
                    lastName: get_users.rows[i].last_name,
                    patronymic: get_users.rows[i].patronymic,
                    dob: get_users.rows[i].dob,
                    roles: roles
                }
                users.push(user);
                roles = []
            } else if (get_users.rows[i] && get_users.rows[i + 1] === undefined ) {
                roles.push(get_users.rows[i].role_id)
                let user = {
                    user_id: get_users.rows[i].id,
                    active: get_users.rows[i].active,
                    email: get_users.rows[i].email,
                    phone: get_users.rows[i].phone,
                    firstName: get_users.rows[i].first_name,
                    lastName: get_users.rows[i].last_name,
                    patronymic: get_users.rows[i].patronymic,
                    dob: get_users.rows[i].dob,
                    roles: roles
                }
                users.push(user);
                roles = []
            } else {
                roles.push(get_users.rows[i].role_id)
            }
        }
        console.log(get_users.rows)
        return users
    }

}

const user = new UsersModel();
export { user };