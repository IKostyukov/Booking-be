import { equipmentmodel } from '../models/equipment_model.js';
import { validationResult } from 'express-validator';
import i18n from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from '../enums/http_status_codes_enums.js';
import { getPagination, getPagingData } from './_pagination.js';

class EquipmentController {


    validationSchema = {

        equipmentId: {

            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: equipmentId => {
                    return equipmentId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipmentId') },
                bail: true,
            },
            custom: {
                options: (equipmentId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return equipmentmodel.isExist(equipmentId).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from validationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Equipment with equipment_id = ${equipmentId} is not in DB (from equipment_controller.js)')
                                return Promise.reject('404 ' + i18n.__('validation.isExist', `equipment_id = ${equipmentId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in validationSchema at equipment_conrtoller.js")
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

        equipment_name: {

            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'equipment_name') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'equipment_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'equipment_name') },
                options: { min: 2, max: 100 },
                bail: true,
            },
            custom: {
                options: (value, { req, location, path }) => {
                    console.log(value, req, "----> req.params.equipmentId")
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return equipmentmodel.isUnique(value).then(is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows equipment from validationSchema')

                            if (is_unique.rows[0].exists == true) {
                                console.log('Equipment with equipment_name = ${value} is not in DB (from equipment_controller.js)')
                                return Promise.reject(i18n.__('validation.isUnique', `equipment_name '${value}'`));
                            }
                        }).catch(err => {
                            if (err.error) {
                                const server_error = {
                                    "success": false,
                                    "error": {
                                        "code": err.statusCode,
                                        "message": err.error.message,
                                    },
                                    "data": {
                                        "equipment_name": err.data,
                                    }
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at equipment_conrtoller.js")
                                return Promise.reject(server_error)
                            } else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    }
                },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        capacity: {  // в БД это (var char 2)
            in: ['body'],
            optional: true,
            isNumeric: {
                errorMessage: () => { return i18n.__('validation.isNumeric', 'capacity') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'capacity') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'capacity') },
                options: { min: 1, max: 2 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        active: {
            in: ['body'],
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

        // Валидация для поисковаго запроса
        // Перенести в отдельный контроллер или же в провайдер, так будет легче делать check_form
        //     "{
        //         location: String,
        //         acitvity_name: String,
        //         date_start: Int,
        //         date_end: Int,
        //         time_start: Int,
        //         time_end: Int,
        //         capacity: Int,  ---> см выше
        //         price_start: Int,
        //         price_end: Int,
        //         max_distance_from_center: Int,
        //         services: [Int],
        //         equipment_id: [Int],
        //         short: Boolean
        // }"

        location: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'location') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'location') },
                options: { min: 1, max: 30 },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        acitvity_name: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'acitvity_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'acitvity_name') },
                options: { min: 1, max: 100 },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        date_start: {
            in: ['body'],
            optional: true,
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'date_start') },
                bail: true,
            },
        },
        date_end: {
            in: ['body'],
            optional: true,
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'date_end') },
                bail: true,
            },
        },
        time_start: {
            in: ['body'],
            optional: true,
            isISO8601: {  //isISO8601  требует представление даты и времени
                // strict: true, 
                // strictSeparator: true ,
                errorMessage: () => { return i18n.__('validation.isISO8601', 'time_start') },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        time_end: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'time_end') },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        price_start: {
            in: ['body'],
            optional: true,
            isInt: {
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'price_start') },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        price_end: {
            in: ['body'],
            optional: true,
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: {
                    min: 0,
                    max: 1000000
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'price_end') },
                bail: true,
            },
        },

        max_distance_from_center: {
            in: ['body'],
            optional: true,
            isInt: {
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'max_distance_from_center') },
                bail: true,
            },
        },
        services: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'services') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'services') },
                bail: true
            },
        },

        'services.*': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'services') },
                bail: true,
            },
            isInt: {
                errorMessage: () => { return i18n.__('validation.isInt', 'services') },
                options: { min: 0, max: 100 },
                bail: true,
            },
        },

        equipment_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'equipment_id') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'services') },
                bail: true
            },
        },

        'equipment_id.*': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'equipment_id') },
                bail: true,
            },
            isInt: {
                errorMessage: () => { return i18n.__('validation.isInt', 'equipment_id') },
                options: { min: 0 },
                bail: true,
            },
        },

        short: {
            in: ['body'],
            optional: true,
            isBoolean: {
                errorMessage: () => { return i18n.__('validation.isBoolean', 'short') },
                bail: true,
            },
        },

        state: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'state')},
                bail: true,
            },                
            isIn: { 
                options: [['active', 'notactive', 'pending']],
                errorMessage: () => { return i18n.__('validation.isIn', 'state')},
                bail: true,
            },
        },

        sortBy: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'sortBy')},
                bail: true,
            },                
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'sortBy') },
                bail: true,
            },
        },

        'sortBy.*.field': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'field') },
                bail: true,
            },
            isIn: { 
                options: [['equipment_id', 'activity_id', 'equipment_name']],
                errorMessage: () => { return i18n.__('validation.isIn', 'field')},
                bail: true,
            },
        },

        'sortBy.*.direction': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'direction') },
                bail: true,
            },
            isIn: { 
                options: [['asc', 'desc']],
                errorMessage: () => { return i18n.__('validation.isIn', 'direction')},
                bail: true,
            },
        },

        size: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'size') },
                bail: true,
            },
            isInt: {
                options: { min: 1, max: 100 },
                errorMessage: () => { return i18n.__('validation.isInt', 'size') },
                bail: true,
            },
        },

        page: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'page') },
                bail: true,
            },
            isInt: {
                options: { min: 1, max: 10000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'page') },
                bail: true,
            },
        },

        s: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 's') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 's') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 's') },
                options: { min: 0, max: 100 },
                bail: true,
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
                    console.log(not_found_error, ` ----> not_found_error from the EquipmentController.checkResult`)
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                } else {
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ----> bad_request_error from the EquipmentController.checkResult`)
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            } else {
                const server_error = data
                console.log(server_error, ` ----> server_error from the EquipmentController.checkResult`)
                res.status(server_error.statusCode || 500).json(server_error)
            }
        } else {
            return next()
        }
    }

    async createEquipment(req, res) {
        try {
            const { equipment_name, activity_id, capacity } = req.body
            const new_equipment = await equipmentmodel.create(equipment_name, activity_id, capacity)
            if (new_equipment.rows[0].id) {
                const result = {
                    success: true,
                    data: " Equipment successfully created"
                }
                console.log(new_equipment.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error('equipment_name', 'Unhandled Error')
                console.log(result, ' ----> err from createEquipment function at equipment_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in createEquipment function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateEquipment(req, res) {
        try {
            const equipment_id = req.params.equipmentId
            const { equipment_name, capacity } = req.body
            console.log(equipment_name, equipment_id, capacity)
            const updated_equipment = await equipmentmodel.update(equipment_name, equipment_id, capacity)
            if (updated_equipment.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Equipment successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updated_equipment.rows, result)
            } else {
                const result = new Api404Error('equipment_id', i18n.__('validation.isExist', `equipment_id = ${equipment_id}`))
                console.log(result, ' ----> err from updateEquipment function at equipment_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateEquipment function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activateEquipment(req, res) {
        try {
            const { active } = req.body
            const equipment_id = req.params.equipmentId
            const activated_equipment = await equipmentmodel.activate(equipment_id, active)
            console.log(activated_equipment.rows[0].active)
            if (activated_equipment.rowCount == 0) {
                const result = new Api404Error('equipment_id', i18n.__('validation.isExist', `equipment_id  ${equipment_id}`))
                console.log(result, ` ----> err in activateEquipment function with equipment_id ${equipment_id} not exists at equipment_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_equipment.rows[0].active === true) {
                const result = {
                    success: true,
                    data: " Equipment successfully activated"
                }
                console.log(activated_equipment.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = {
                    success: true,
                    data: " Equipment successfully deactivated"
                }
                console.log(activated_equipment.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateEquipment function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteEquipment(req, res) {
        try {
            const equipment_id = req.params.equipmentId
            const deleted_equipment = await equipmentmodel.delete(equipment_id)
            if (deleted_equipment.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Equipment successfully deleted"
                }
                console.log(deleted_equipment.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_equipment.rows.length == 0) {
                const result = new Api404Error('equipment_id', i18n.__('validation.isExist', `equipment_id = ${equipment_id}`))
                console.log(result, ' ----> err in deleteEquipment function with equipment_id = ${equipment_id} not exists at equipment_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteEquipment function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveSingleEquipment(req, res) {
        try {
            const equipment_id = req.params.equipmentId
            const get_equipment = await equipmentmodel.findOne(equipment_id)
            if (get_equipment.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_equipment.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('equipment_id', i18n.__('validation.isExist', `equipment_id = ${equipment_id}`))
                console.log(result, ` -----> err in getEquipment function with equipment_id = ${equipment_id} not exists at equipment_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in getEquipment function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleEquipments(req, res) {
        try {
            // console.log(req.query)
            const { state, sortBy, size, page, s } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const get_equipments = await equipmentmodel.findAll({ state, sortBy, limit, offset, s })
            // console.log(get_equipments)

            if (get_equipments[0].rows.length !== 0) {
                console.log(get_equipments[0].rows, get_equipments[1].rows)
                const pagination = getPagingData(get_equipments, page, limit);
                // console.log(pagination) 
                const result = {
                    "success": true,
                    "data": get_equipments[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('equipment_name', i18n.__('validation.isExist', `equipment_name ${s}`))
                console.log(result, ` -----> err in retrieveMultipleEquipments function not exists at equipment_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleEquipments function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async getSearchEquipment(req, res) {
        try {
            const body = req.body
            const get_equipments = await equipmentmodel.getSearch(body)
            if (get_equipments.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_equipments.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('getSearchEquipment', i18n.__('validation.isExist', 'equipment'))
                console.log(result, ` -----> err 404 Not Found in getSearchEquipment function   at equipment_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in getSearchEquipment function at equipment_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


}

const equipment_controller = new EquipmentController();
export { equipment_controller }