import { pool } from '../db.js';
import uid from 'uid2';

const db = pool

// //  UUID generaate

// const service = 'local'

// const create_uuid = async () => {
//     let profile_id =  uid(15)
//     console.log(profile_id)
//     return profile_id
// }

// const service = 'local'
// let sql_query = " ";
// async function insert_uuid (service) {
//     //    console.log('profile_id')

    
//     for (let i = 0; i < 1094; i += 1) {
//        let profile_id =  uid(15)
//        console.log(profile_id)
//             // id => "hbswt489ts"
//         sql_query += `UPDATE users SET profile_id = '${profile_id}', 
//         service = '${service}' WHERE id = ${i} RETURNING *;`
//                             //  console.log(sql_query)
//                } 
//                console.log(sql_query)  
//     await db.query(sql_query)
//     }


            //  Hash Password  https://stackoverflow.com/

// const postgres = require('../../lib/postgres');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// exports.logEmployee = (req, res) => {
//     res.status(200).json({ token: 'Bearer ' + jwt.sign(req.employee, process.env.SECRET, { expiresIn: 1800 }) });//expires in 1800 seconds
//     res.end();
// };

// exports.hashPassword = (req, res, next) => {
//     crypto.scrypt(req.body.password.toString(), 'salt', 256, (err, derivedKey) => {
//         if (err) {
//             return res.status(500).json({ errors: [{ location: req.path, msg: 'Could not do login', param: req.params.id }] });
//         }
//         req.body.kdfResult = derivedKey.toString('hex');
//         next();
//     });
// };

// exports.lookupLogin = (req, res, next) => {
//     const sql = 'SELECT e.employee_id, e.login FROM employee e WHERE e.login=$1 AND e.password = $2';
//     postgres.query(sql, [req.body.login, req.body.kdfResult], (err, result) => {
//         if (err) {
//             return res.status(500).json({ errors: [{ location: req.path, msg: 'Could not do login', param: req.params.id }] });
//         }
//         if (result.rows.length === 0) {
//             return res.status(404).json({ errors: [{ location: req.path, msg: 'User or password does not match', param: req.params.id }] });
//         }
//         req.employee = result.rows[0];
//         next();
//     });
// };


class UsersModel {

    async isExist(user_id) {
        try{
            console.log(' ___________TTTTTTTTTTTTTTTTTTT________________')
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM users WHERE id = ${user_id}) AS "exists";`
        
            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, ' -----> is_exist.rows from UsersModel')
            return  is_exist
        } catch (err) {                                       
            console.log(err, `-----> err in isExist function with user_id = ${user_id}  at  user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error( 'user_id', `${err.message}`)                                                                  
        }
    }

    async isUnique(email) {
        const sql_query = `SELECT EXISTS (SELECT 1
        FROM users WHERE email = '${email}') AS "exists";`
        try{
            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, ' -----> is_unique.rows from user_model.js')
            return  is_unique
        }catch (err) {                                       
            console.log(err, `-----> err in isUnique function with email = ${email}  in user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error( 'email', `${err.message}`)                                                                
        }
    }

    async create(email, phone, first_name, last_name, patronymic, dob,  profile_id, service,  roles_id) {        
        const new_user = await db.query(`INSERT INTO users 
        (email, phone, first_name, last_name, patronymic, 
        dob, ctime, profile_id, service) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
        RETURNING *;`, [email, phone, first_name, last_name, patronymic, dob,  profile_id, service])
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

    async findOne(username, callback) { 
        console.log(username, "username comes to model")
        const sql = `SELECT id, active, email, phone, first_name, last_name, patronymic, dob, password 
        FROM users
        WHERE last_name = '${username.last_name}' LIMIT 1;` 
        console.log(sql, 'sql -test')

        const found_user = await db.query(sql)        
        console.log(found_user.rows, 'test findOne from user_model.js-73')

        if (found_user.rows == undefined) {
            const err = found_user // "Error 400 "
            const user = null   
            console.log(err, user, "test user_model.js-78")         
            callback(err, user)
        }
        
        if (found_user.rows.length == 0) {
            const err = null 
            const user = null   
            console.log(err, user, "test (err, user) Error 401 (User not found) user_model.js -84")         
            callback(err, user)

        } else if (found_user.rows[0]) {
            const err = null
            const user = found_user.rows[0]
            console.log(err, user, "test (err, user) (User found) user_model.js -90") 
            callback(err, user)
        }        
    }


    async findByProfileId(profile) { 
        console.log(profile, "profile comes to model")
        const sql = `SELECT id, active, email, phone, first_name, last_name, patronymic,
        dob, password, profile_id, service
        FROM users
        WHERE profile_id = '${profile.profile_id}' ;` 
        console.log(sql, 'sql -test')

        const found_user = await db.query(sql)        
        console.log(found_user.rows, 'found_user.rows test findByProfileId from user_model.js-129')

        if (found_user.rows == undefined) {
            const err = found_user // "Error 400 "
            const user = null   
            console.log(err, user, "test user_model.js-134")
            return found_user         
        }
        
        if (found_user.rows.length == 0) {
            const err = null 
            const user = null   
            console.log(err, user, "test (err, user) Error 401 (User not found) user_model.js -140")         
            return found_user         


        } else if (found_user.rows[0]) {
            const err = null
            const user = found_user.rows[0]
            console.log(err, user, "test (err, user) (User found) user_model.js -145") 
            return found_user     
        }        
    }

    // async validPassword(password) {
    //     if (password == user.password) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

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