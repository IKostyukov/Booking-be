import { pool } from '../db.js';
import Api500Error from '../errors/api500_error.js';

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

    async isExistUserId(user_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM users WHERE id = ${user_id}) AS "exists";`

            const is_exist = await db.query(sql_query)
            console.log(is_exist.rows, ' -----> is_exist.rows from UsersModel')
            return is_exist
        } catch (err) {
            console.log(err, `-----> err in isExist function with user_id = ${user_id}  at  user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('user_id', `${err.message}`)
        }
    }

    async isExistRoles(roles) {
        try {
            console.log(roles, typeof (roles), ' roles ----->>>')
            let arr_roles = roles.map(Number);
            const roles_id = await db.query(`SELECT id AS exists FROM roles ORDER BY id;`)   // Проверуку убрать в контороллер в валидациию
            let list_roles_id = []
            roles_id.rows.forEach(element => {
                list_roles_id.push(element.exists)
            });

            let difference = arr_roles.filter(x => !list_roles_id.includes(x));
            console.log(roles_id.rows, arr_roles, list_roles_id, ' difference ----->>>', difference)
            if (difference.length == 0) {
                return { exists: true }
            } else {
                return { exists: false }

            }
        } catch (err) {
            console.log(err, `-----> err in isExist function with roles = ${roles}  at  user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                  
            throw new Api500Error('roles', `${err.message}`)
        }
    }

    async isUniqueEmail(email) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM users WHERE email = '${email}') AS "exists";`

            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, ' -----> is_unique.rows from user_model.js')
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isUnique function with email = ${email}  in user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('email', `${err.message}`)
        }
    }

    async isUniqueProfilId(profile_id) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM users WHERE profile_id = '${profile_id}') AS "exists";`

            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, ' -----> is_unique.rows in  isUniqueProfilId function from user_model.js')
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isUniqueProfilId function with profile_id = ${profile_id}  in user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('profile_id', `${err.message}`)
        }
    }

    async isUniqueCombination(profile_id, service) {
        try {
            const sql_query = `SELECT EXISTS (SELECT 1
            FROM users WHERE profile_id = '${profile_id}' AND service = '${service}') AS "exists";`

            const is_unique = await db.query(sql_query)
            console.log(is_unique.rows, ' -----> is_unique.rows in  isUniqueCombination function from user_model.js')
            return is_unique
        } catch (err) {
            console.log(err, `-----> err in isUniqueCombination function with profile_id = ${profile_id}  in user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('profile_id, service', `${err.message}`)
        }
    }

    async create(email, phone, first_name, last_name, patronymic, dob, profile_id, service, roles_id) {
        try {
            const new_user = await db.query(`INSERT INTO users 
            (email, phone, first_name, last_name, patronymic, 
            dob, ctime, profile_id, service) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
            RETURNING *;`, [email, phone, first_name, last_name, patronymic, dob, profile_id, service])
            const user_id = new_user.rows[0].id
            let sql_query = " "

            for (let i = 0; i < roles_id.length; i += 1) {
                sql_query += `INSERT INTO users_roles (user_id, role_id) 
                VALUES (${user_id}, ${roles_id[i]}) RETURNING *;`
            }
            const new_role = await db.query(sql_query)

            if (roles_id.length > 1) {
                console.log(new_role[0].rows, ' ----> new_role[0].rows at serviceprovider_model.js')
                return { new_user: new_user, new_role: new_role }
            } else {
                console.log(new_role.rows, ' ----> new_role.rows at serviceprovider_model.js')
                return { new_user: new_user, new_role: [new_role] }
            }
        } catch (err) {
            console.log(err, `-----> err in create function with email = ${email}  at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('create user', `${err.message}`)
        }
    }

    async update(user_id, email, phone, first_name, last_name, patronymic, dob, roles) {
        try {
            // const roles_arr = Array.from(roles.split(','), Number)
            const roles_arr = Array.from(roles, Number)

            const sql = `UPDATE users
            SET email='${email}', phone=${phone}, first_name='${first_name}', last_name='${last_name}', patronymic='${patronymic}', dob='${dob}',  mtime=NOW()
            WHERE id = ${user_id}
            RETURNING *;`
            // console.log(sql)
            const updated_user = await db.query(sql)
            // console.log(updated_user.rows, ' ---> updated_user.rows at user_model.js' )
            let string_delete = `DELETE FROM users_roles WHERE user_id = ${user_id};`
            let string_update = " "
            let sql_query = " "
            for (let i = 0; i < roles_arr.length; i += 1) {
                string_update += `INSERT INTO users_roles (user_id, role_id) 
                    VALUES (${user_id}, ${roles_arr[i]}) RETURNING *;`
            }
            sql_query = string_delete + string_update
            // console.log(sql_query)
            const updated_roles = await db.query(sql_query) // 'insert or update on table "users_roles" violates foreign key constraint "user_id"
            // console.log(updated_roles[1])                    // то есть не можеть DELETE FROM users_roles WHERE user_id = ${user_id};`


            return { updated_user: updated_user, updated_roles: updated_roles }
        } catch (err) {
            console.log(err, `-----> err in update function with user_id = ${user_id}  at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('user_id', `${err.message}`)
        }
    }

    async activate(user_id, active) {
        try {
            const activated_person = await db.query(`UPDATE users
            SET active = $2
            WHERE id = $1
            RETURNING *;`, [user_id, active])
            //console.log(activated_person.rows)
            return activated_person
        } catch (err) {
            console.log(err, `-----> err in activate function with user_id = ${user_id}  at user_model.js`)
            // console.log(err.message, '-----> err.message') 
            throw new Api500Error('user_id', `${err.message}`)
        }
    }

    async delete(user_id) {
        try {
            const deleted_person = await db.query(`DELETE FROM users 
            WHERE id = $1 RETURNING *;`, [user_id])
            return deleted_person
        } catch (err) {
            console.log(err, `-----> error  in delete function with user_id = ${user_id}  at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('user_id', `${err.message}`)
        }
    }

    async findOne(username, callback) {
        try {
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
        } catch (err) {
            console.log(err, `-----> err  in findOne function with username = ${username}  at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('username', `${err.message}`)
        }
    }

    async findByProfileId(profile) {
        try {
            console.log(profile, "profile comes to user_model")
            const sql = `SELECT id, active, email, phone, first_name, last_name, patronymic,
            dob, password, profile_id, service
            FROM users
            WHERE profile_id = '${profile.profile_id}' ;`
            console.log(sql, 'sql -test')

            const found_user = await db.query(sql)
            console.log(found_user.rows, 'found_user.rows test findByProfileId from user_model.js')

            if (found_user.rows == undefined) {
                const err = found_user // "Error 400 "
                const user = null
                console.log(err, user, "test user_model.js-134")
                return found_user
            }

            if (found_user.rows.length == 0) {
                const err = null
                const user = null
                console.log(err, user, "test (err, user) Error 401 (User not found) user_model.js")
                return found_user


            } else if (found_user.rows[0]) {
                const err = null
                const user = found_user.rows[0]
                console.log(err, user, "test (err, user) (User found) user_model.js")
                return found_user
            }
        } catch (err) {
            console.log(err, `-----> err  in findByProfileId function with profile_id = ${profile.profile_id}  at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('profile_id', `${err.message}`)
        }
    }

    // async validPassword(password) {
    //     if (password == user.password) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    async findOneWithRoles(user_id) {
        try {
            const get_user = await db.query(`SELECT id, AS user_id, active, email, phone, first_name, last_name, patronymic, dob, role_id 
            FROM users LEFT JOIN users_roles ON users.id = users_roles.user_id WHERE users.id = ${user_id};`)
            console.log(user_id, get_user, ' ----> getOneWithRoles at user_model.js')
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
        } catch (err) {
            console.log(err, `-----> err  in findOneWithRoles function with user_id = ${user_id}  at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('user_id', `${err.message}`)
        }
    }

    async findAll({ state, sortBy, limit, offset, s }) {
        // (first_name, last_name, email, phone) {
        try {
            console.log({ state, sortBy, limit, offset, s })
            let sort_by_field = 'id'
            let sort_by_direction = 'ASC'

            if (sortBy && sortBy[0].field) {
                sort_by_field = sortBy[0].field
            }
            if (sortBy && sortBy[0].direction) {
                sort_by_direction = sortBy[0].direction
            }

            let search_condition;
            if (s) {
                const first_name = s.firstName;
                const last_name = s.lastName;
                const email = s.email;
                const phone = s.phone;
                search_condition = `first_name LIKE '%'||'${first_name}'||'%' OR last_name LIKE '%'||'${last_name}'||'%' 
                                    OR email LIKE '%'||'${email}'||'%'  OR phone LIKE '%'||'${phone}'||'%'  `
            }

            let sql_query = `SELECT  id, active, email, phone, first_name, last_name, patronymic, dob, role_id 
                            FROM users LEFT JOIN users_roles ON users.id = users_roles.user_id `
            let condition = ''

            const where = `WHERE `
            const state_condition = `active = 'true' `
            const filter = `ORDER BY ${sort_by_field} ${sort_by_direction} LIMIT ${limit} OFFSET ${offset} `
            const query_count = 'SELECT COUNT(id) AS count FROM users LEFT JOIN users_roles ON users.id = users_roles.user_id  '
            const and = 'AND '
            const group = 'GROUP BY users.id  '
            const end = '; '


            if (state && s) {
                condition += state_condition + and + search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + group + end
            } else if (state) {
                condition += state_condition
                sql_query += where + condition + filter + end + query_count + where + condition + group + end
            } else if (s) {
                condition += search_condition
                sql_query += where + condition + filter + end + query_count + where + condition + group + end
            } else {
                sql_query += filter + end + query_count + group + end
            }

            // console.log(sql_query, `-----> sql_query  in findAll function at user_model.js`)

            const get_users = await db.query(sql_query)

            // console.log(get_users[0].rows, get_users[1].rows)

            // const get_users = await db.query(`SELECT  id, active, email, phone, first_name, last_name, patronymic, dob, role_id 
            // FROM users LEFT JOIN users_roles ON users.id = users_roles.user_id 
            // WHERE first_name LIKE '%'||$1||'%' OR last_name LIKE '%'||$2||'%' OR email LIKE '%'||$3||'%'
            // OR phone LIKE '%'||$4||'%' ;`, [first_name, last_name, email, phone])

            let users = [{ 'rows': [] }, { 'rows': [{ 'count': 0 }] }]
            let roles = []

            for (let i = 0; i < get_users[0].rowCount; i += 1) {
                if (get_users[0].rows[i] && get_users[0].rows[i + 1] && get_users[0].rows[i].id !== get_users[0].rows[i + 1].id) {
                    roles.push(get_users[0].rows[i].role_id)
                    let user = {
                        user_id: get_users[0].rows[i].id,
                        active: get_users[0].rows[i].active,
                        email: get_users[0].rows[i].email,
                        phone: get_users[0].rows[i].phone,
                        firstName: get_users[0].rows[i].first_name,
                        lastName: get_users[0].rows[i].last_name,
                        patronymic: get_users[0].rows[i].patronymic,
                        dob: get_users[0].rows[i].dob,
                        roles: roles
                    }
                    users[0].rows.push(user);
                    roles = []
                } else if (get_users[0].rows[i] && get_users[0].rows[i + 1] === undefined) {
                    roles.push(get_users[0].rows[i].role_id)
                    let user = {
                        user_id: get_users[0].rows[i].id,
                        active: get_users[0].rows[i].active,
                        email: get_users[0].rows[i].email,
                        phone: get_users[0].rows[i].phone,
                        firstName: get_users[0].rows[i].first_name,
                        lastName: get_users[0].rows[i].last_name,
                        patronymic: get_users[0].rows[i].patronymic,
                        dob: get_users[0].rows[i].dob,
                        roles: roles
                    }
                    users[0].rows.push(user);
                    users[1].rows[0].count = get_users[1].rows.length;
                    roles = []
                } else {
                    roles.push(get_users[0].rows[i].role_id)
                }
            }
            // console.log(users)
            return users
        } catch (err) {
            console.log(err, `-----> err  in findAll function   at user_model.js`)
            // console.log(err.message, '-----> err.message')                                                                   
            throw new Api500Error('email', `${err.message}`)
        }
    }
}

const user = new UsersModel();
export { user };