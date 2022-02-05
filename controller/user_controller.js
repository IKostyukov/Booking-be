import uid from 'uid2';
import { pool } from '../db.js';
import { user } from '../models/user_model.js';
import { favoriteequipment_model } from '../models/favoriteequipment_model.js';
import { equipmentprovidermodel } from '../models/equipmentprovider_model.js';


import { validationResult } from 'express-validator';
import i18n from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from '../enums/http_status_codes_enums.js';



const db = pool

//  UUID generaate

const createUuid = (req) => {
    let profile_id = uid(15)
    return profile_id
};


class UserController {

    validationSchema = {

        userId: {
            in: ['params'],
            optional: true,
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: userId => {
                    return userId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'userId') },
                bail: true,
            },
            custom: {
                options: (userId, { req, location, path }) => {
                    if(req.methods === 'GET'){
                        return true
                    }else{
                        return user.isExistUserId(userId).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows userId from validationSchema')
    
                            if (is_exist.rows[0].exists !== true) {
                                console.log('User with user_id = ${userId} is not in DB (from user_controller.js)')
                                return Promise.reject('404 Error:' + i18n.__('validation.isExist', `user_id = ${userId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code": err.statusCode,
                                        "message": err.error.message,
                                    },
                                    "data": err.data,
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                                return Promise.reject(server_error)
                            } else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
        },

        equipmentId: {
            in: ['params'],
            optional: true,
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: userId => {
                    return userId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipmentId') },
                bail: true,
            },
            custom: {
                options: (equipmentId, { req, location, path }) => {
                    if(req.methods === 'GET'){
                        return equipmentprovidermodel.isExist(equipmentId).then(is_exist => {
                            console.log(is_exist, '-------> is_exist equipmentId from validationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Equipment with equipmentId = ${equipmentId} is not in DB (from user_controller.js)')
                                return Promise.reject('404 Error: ' + i18n.__('validation.isExist', `equipmentId = ${equipmentId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            } else {
                                const user_id = req.params.userId
                                return favoriteequipment_model.isUniqueCombination(user_id, equipmentId).then(is_unique => {
                                    console.log(is_unique.rows, '-------> is_exist.rows of parent_user_id from validationSchema')

                                    if (is_unique.rows[0].exists == true) {
                                        return Promise.reject(i18n.__('validation.isUniqueCombination', `user_id = ${user_id} & equipmentId = ${equipmentId}`));
                                    }
                                }).catch(err => {
                                    if (err.error) {
                                        const server_error = {
                                            "success": false,
                                            "error": {
                                                "code": err.statusCode,
                                                "message": err.error.message,
                                            },
                                            "data": err.data,
                                        }
                                        console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                                        return Promise.reject(server_error)
                                    } else {
                                        const msg = err
                                        return Promise.reject(msg)
                                    };
                                })
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code": err.statusCode,
                                        "message": err.error.message,
                                    },
                                    "data": err.data,
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                                return Promise.reject(server_error)
                            } else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
        },

        email: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'email') },
                bail: true,
            },
            isEmail: {
                errorMessage: () => { return i18n.__('validation.isEmail') },
                bail: true,
            },
            custom: {              
                options: (email, { req, location, path }) => {                  
                    if(req.method === 'GET'){
                        return true
                    }else{
                        return user.isUniqueEmail(email).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows of email from validationSchema')
    
                            if (is_exist.rows[0].exists == true) {
                                return Promise.reject(i18n.__('validation.isUnique', `email = ${email}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code": err.statusCode,
                                        "message": err.error.message,
                                    },
                                    "data": err.data,
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                                return Promise.reject(server_error)
                            } else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
            trim: true,
            escape: true,
        },

        password: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'password') },
                bail: true,
            },
            isStrongPassword: {
                errorMessage: () => { return i18n.__('validation.isStrongPassword', 'password') },
                bail: true,
            },
        },

        first_name: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'first_name') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'first_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'first_name') },
                options: { min: 1, max: 20 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        last_name: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'last_name') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'last_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'last_name') },
                options: { min: 1, max: 20 },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        
        patronymic: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'patronymic') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'patronymic') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'patronymic') },
                options: { min: 1, max: 20 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

       // Проверка на всякий случай, хотя  приходить profile_id никогда не будет

        profile_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'profile_id') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'profile_id') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'profile_id') },
                options: { min: 12, max: 25 },
                bail: true,
            },
            custom: {
                options: (profile_id, { req, location, path }) => {
                    console.log(req.body, '--------------------------->>>')
                    // if (req.body.service == 'locale') {

                    // } else  {
                    //     // Добаваить Google profile_id
                    //     // Добаваить Facebook profile_id
                    // }
                    console.log(profile_id, "createUuid from user_controller.js")
                    return user.isUniqueProfilId(profile_id).then(is_unique => {
                        console.log(is_unique.rows, '-------> is_exist.rows of parent_user_id from validationSchema')

                        if (is_unique.rows[0].exists == true) {
                            return Promise.reject(i18n.__('validation.isUnique', `profile_id = ${profile_id}`));
                        }
                    }).catch(err => {
                        if (err.error) {
                            const server_error = {
                                "success": false,
                                "error": {
                                    "code": err.statusCode,
                                    "message": err.error.message,
                                },
                                "data": err.data,
                            }
                            console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                            return Promise.reject(server_error)
                        } else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
            trim: true,
            escape: true,
        },

        dob: {
            in: ['body'],
            optional: true,
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'dob') },
                bail: true,
            },
        },

        phone: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'phone') },
                bail: true,
            },
            isMobilePhone: {
                errorMessage: () => { return i18n.__('validation.isMobilePhone', 'phone') },
                bail: true,
            },
        },

        active: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'active') },
                bail: true,
            },
            isBoolean: {
                errorMessage: () => { return i18n.__('validation.isBoolean', 'active') },
                bail: true,
            },
        },

        roles: {
            in: ['body'],
            optional: true,
            custom: {
                options: (roles, { req, location, path }) => {
                    console.log(req.body.roles, typeof(req.body.roles),' -------> req.roles  from validationSchema')
                    return user.isExistRoles(roles).then(is_exist => {
                        console.log(is_exist.exists, '-------> is_exist.exists at roles from validationSchema')

                        if (is_exist.exists == false) {
                            console.log('User ${req.params.userId} with roles = ${roles} is not in DB (from user_controller.js)')
                            return Promise.reject('404 Error: ' + i18n.__('validation.isExist', `User ${req.params.userId} with roles = ${roles}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        }
                    }).catch(err => {
                        if (err.error) {
                            const server_error = {
                                "success": false,
                                "error": {
                                    "code": err.statusCode,
                                    "message": err.error.message,
                                },
                                "data": err.data,
                            }
                            console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                            return Promise.reject(server_error)
                        } else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        service: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'service') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'service') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'service') },
                options: { min: 1, max: 10 },
                bail: true,
            },
            isIn: {
                errorMessage: () => { return i18n.__('validation.isIn', 'service') },
                options: [['locale', 'facebook', 'google']],
                bail: true,
            },
            custom: {  // Проверка на всякий случай, хотя в приходить profile_id никогда не будет
                options: (service, { req, location, path }) => {
                    if(req.body.profile_id === undefined){
                        return true                       
                    }else{
                         // const profile_id = req.body.profile_id
                         return user.isUniqueCombination(profile_id, service).then(is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows of profile_id from validationSchema')
    
                            if (is_unique.rows[0].exists == true) {
                                return Promise.reject( i18n.__('validation.isUniqueCombination', `profile_id = ${profile_id} & service = ${service}`));  
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code": err.statusCode,
                                        "message": err.error.message,
                                    },
                                    "data": err.data,
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at user_conrtoller.js")
                                return Promise.reject(server_error)
                            } else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
            },
            trim: true,
            escape: true,
        },
    }

    checkResult(req, res, next) {
        console.log(" ----> checkResult")
        // console.log(i18n.getLocale(),'------> locale')

        const validation_result = validationResult(req)
        const hasError = !validation_result.isEmpty();
        console.log(hasError, " ----> hasError", validation_result.array(), " ----> validation_result",)
        if (hasError) {
            const data = validation_result.errors[0].msg

            if (typeof (data) !== 'object') {
                if (data.startsWith('404')) {
                    const param = validation_result.errors[0].param
                    const not_found_error = new Api404Error(param, data)
                    console.log(not_found_error, ` ----> not_found_error from the userController.checkResult`)
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                } else {
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ----> bad_request_error from the userController.checkResult`)
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            } else {
                const server_error = data
                console.log(server_error, ` ----> server_error from the userController.checkResult`)
                res.status(server_error.statusCode || 500).json(server_error)
            }
        } else {
            return next()
        }
    }



    async createUser(req, res) {
        try {
            let profile_id = '';                

            if(req.body.service == 'locale'){
                // Сщздаем profile_id для стратегии аутентификации " locale"  и проверяем на уникальность
                let is_uuid_exists
                do {
                    // let profile_id = 'uUbrCK9JwlgqidL'
                    profile_id = createUuid();                
                    const is_unique = await user.isUniqueProfilId(profile_id);
                    let is_uuid_exists = is_unique.rows[0].exists
                    console.log(is_uuid_exists, '---> is_uuid_exists in createUser function at user_controller.js')
                } while (is_uuid_exists == true);
                profile_id = 'l_' + profile_id

            }else if (req.body.service == 'facebook'){
                 // profile_id = 'f_' + 'Добаваить Facebook profile_id'
                const is_unique = await user.isUniqueProfilId(profile_id);

            }else if (req.body.service == 'google'){
                 // profile_id = 'g_'+ 'Добаваить Google profile_id'
                 const is_unique = await user.isUniqueProfilId(profile_id);

            }else{
                const result = new Api400Error('service', i18n.__('validation.isExist', `service = ${req.body.service}`))
                console.log(result, ' ----> err from createUser function at user_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
            
            const { email, phone, first_name, last_name, patronymic, dob, service, roles } = req.body
            // const roles_id = Array.from(roles.split(','), Number)
            const roles_id = Array.from(roles, Number)
            const new_person = await user.create(email, phone, first_name, last_name, patronymic, dob, profile_id, service, roles_id)
            if (new_person.new_user.rows[0].id && new_person.new_role[0].rows[0].role_id) {
                const result = {
                    success: true,
                    data: " User successfully created"
                }
                console.log(result, new_person.new_user.rows, ' -----> new_person.rows in createUser function at user_controller.js')
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error('new_person', 'Unhandled Error')
                console.log(result, ' ----> err from createUser function at user_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
            
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in createUser function at user_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  createUser function at user_controller.js ')
                res.json({ 'Code Error': err.message })
            }
        }
    }

    async updateUser(req, res) {
        try {
            const user_id = req.params.userId
            const { email, phone, first_name, last_name, patronymic, dob, roles } = req.body
            const updated_person = await user.update(user_id, email, phone, first_name, last_name, patronymic, dob, roles)
            if (updated_person.updated_user && updated_person.updated_roles) {
                const result = {
                    success: true,
                    data: " User successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(result, updated_person.updated_user.rows, ' -----> updated_person.updated_user.rows in updateMessage function at user_controller.js')
            } else {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ' ----> err from updateUser function at user_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateUser function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activateUser(req, res) {
        try {
            const user_id = req.params.userId
            const active = req.body.active
            const activated_person = await user.activate(user_id, active)
            if (activated_person.rows.length == 0) {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ` ----> err in activateUser function with user_id = ${user_id} not exists at user_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_person.rows[0].is_reminder == false) {
                const result = {
                    success: true,
                    data: " User successfully deactivated"
                }
                console.log(result, activated_person.rows, '-----> activated_person.rows in activateUser function at user_controller.js ')
                res.status(httpStatusCodes.OK || 500).json(success)
            } else if (activated_person.rows[0].is_reminder == true) {
                const result = {
                    success: true,
                    data: " User successfully activated"
                }
                console.log(activated_person.rows, '-----> activated_person.rows in activateUser function at user_controller.js ')
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateUser function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteUser(req, res) {
        try {
            const user_id = req.params.userId
            const deleted_person = await user.delete(user_id)
            if (deleted_person.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " User successfully deleted"
                }
                console.log(deleted_person.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_message.rows.length == 0) {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ' ----> err in deleteUser function with user_id = ${user_id} not exists at user_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteUser function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async getOneUserWithRoles(req, res) {
        try {
            const user_id = req.params.userId
            const get_user = await user.getOneWithRoles(user_id)
            if (get_user) {
                const result = {
                    "success": true,
                    "data": get_user
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ` -----> err in getOneUserWithRoles function  with user_id = ${user_id} not exists at user_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in getOneUserWithRoles function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async getManyUsers(req, res) {
        try {
            const { first_name, last_name, email, phone } = req.body
            const get_users = await user.getMany(first_name, last_name, email, phone)
            if (get_users.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_users.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('getManyUsers', i18n.__('validation.isExist', `getManyUsers`))
                console.log(result, ` -----> err in getManyUsers function  at user_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in getManyUsers function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async addFavoriteEquipment(req, res) {
        try {
            const equipmentprovider_id = req.params.equipmentId
            const user_id = req.params.userId
            const new_favoriteequipment = await favoriteequipment_model.AddFavorite(equipmentprovider_id, user_id)
            if (new_favoriteequipment.rows[0].id) {
                const result = {
                    success: true,
                    data: " Equipment successfully added"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(result, new_favoriteequipment.rows, ' -----> updateMessage.rows in updateMessage function at user_controller.js')
            } else {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ' ----> err from addFavoriteEquipment function at user_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in addFavoriteEquipment function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteFavoriteEquipment(req, res) {
        try {
            const equipmentprovider_id = req.params.equipmentId
            const user_id = req.params.userId
            const deleted_favoriteequipment = await favoriteequipment_model.deleteFavorite(equipmentprovider_id, user_id)
            if (deleted_favoriteequipment.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Equipment successfully deleted"
                }
                console.log(deleted_favoriteequipment.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_favoriteequipment.rows.length == 0) {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ' ----> err in deleteFavoriteEquipment function with user_id = ${user_id} not exists at user_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteFavoriteEquipment function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async getFavoriteEquipment(req, res) {
        try {
            const user_id = req.params.userId
            const list_favoriteequipment = await favoriteequipment_model.getFavorite(user_id)
            if (list_favoriteequipment.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": list_favoriteequipment.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('user_id', i18n.__('validation.isExist', `user_id = ${user_id}`))
                console.log(result, ` -----> err in getFavoriteEquipment function  with user_id = ${user_id} not exists at user_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in getFavoriteEquipment function at user_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }
}

const user_controller = new UserController();
export { user_controller }