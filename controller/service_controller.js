import { servicemodel } from '../models/service_model.js';
import { validationResult } from 'express-validator';
import i18n from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from '../enums/http_status_codes_enums.js';
import { getPagination, getPagingData } from './_pagination.js';


class ServiceControlller {

    validationSchema = {

        serviceId: {
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: serviceId => {
                    return serviceId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'serviceId') },
                bail: true,
            },
            custom: {
                options: (serviceId, { req, location, path }) => {
                    if (req.methods === 'GET') {
                        return true
                    } else {
                        return servicemodel.isExist(serviceId).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows service from validationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Service with service_id = ${serviceId} is not in DB (from service_contrpller.js)')
                                return Promise.reject('404 ' + i18n.__('validation.isExist', `service_id = ${serviceId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                        "service_id": err.data,
                                    }
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at service_conrtoller.js")
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

        service_name: {

            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'service_name') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'service_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'service_name') },
                options: { min: 2, max: 100 },
                bail: true,
            },
            custom: {
                options: (service_name, { req, location, path }) => {
                    console.log(service_name, "----> service_name")
                    return servicemodel.isUnique(service_name).then(is_unique => {
                        console.log(is_unique.rows, '-------> is_unique.rows service from validationSchema')

                        if (is_unique.rows[0].exists == true) {
                            console.log('Service with service_name = ${service_name} is not in DB (from service_contrpller.js)')
                            return Promise.reject(i18n.__('validation.isUnique', `service_name '${service_name}'`));
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at service_conrtoller.js")
                            return Promise.reject(server_error)
                        } else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        active: {
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

        state: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'state') },
                bail: true,
            },
            isIn: {
                options: [['active', 'notactive', 'pending']],
                errorMessage: () => { return i18n.__('validation.isIn', 'state') },
                bail: true,
            },
        },

        sortBy: {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'sortBy') },
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
                options: [['service_id', 'service_name']],
                errorMessage: () => { return i18n.__('validation.isIn', 'field') },
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
                errorMessage: () => { return i18n.__('validation.isIn', 'direction') },
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
        }
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
                    console.log(not_found_error, ` ----> not_found_error from the ServiceController.checkResult`)
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                } else {
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ----> bad_request_error from the ServiceController.checkResult`)
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            } else {
                const server_error = data
                console.log(server_error, ` ----> server_error from the ServiceController.checkResult`)
                res.status(server_error.statusCode || 500).json(server_error)
            }
        } else {
            return next()
        }
    }

    //  ### Создать удобство ###
    async createService(req, res) {
        try {
            const { service_name } = req.body
            const new_service = await servicemodel.ceate(service_name)
            if (new_service.rows[0].id) {
                const result = {
                    success: true,
                    data: " Service successfully created"
                }
                console.log(new_service.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error('service_name', 'Unhandled Error')
                console.log(result, ' ----> err from createService function at service_contrpller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in createService function at service_contrpller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Обновить удобство ###
    async updateService(req, res) {
        try {
            const { service_name } = req.body
            const service_id = req.params.serviceId
            const updated_service = await servicemodel.update(service_id, service_name)
            if (updated_service.rows) {
                const result = {
                    success: true,
                    data: " Service successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updated_service.rows, result)
            } else {
                const result = new Api404Error('service_id', i18n.__('validation.isExist', `service_id = ${service_id}`))
                console.log(result, ' ----> err from updateService function at service_contrpller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateService function at service_contrpller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Активировать удобство ###
    async activateService(req, res) {
        try {
            // console.log(req.params.serviceId)
            const { active } = req.body
            const service_id = req.params.serviceId
            const activated_service = await servicemodel.activate(service_id, active)
            console.log(activated_service.rows)

            if (activated_service.rows.length == 0) {
                const result = new Api404Error('service_id', i18n.__('validation.isExist', `service_id  ${service_id}`))
                console.log(result, ` ----> err in activateService function with service_id ${service_id} not exists at service_contrpller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_service.rows[0].active == true) {
                const result = {
                    success: true,
                    data: " Service successfully activated"
                }
                console.log(activated_service.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = {
                    success: true,
                    data: " Service successfully deactivated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateService function at service_contrpller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Удалить удобство ###
    async deleteService(req, res) {
        try {
            console.log(req.params.serviceId)
            const service_id = req.params.serviceId
            console.log(service_id, "Test deleteService")

            const deleted_service = await servicemodel.delete(service_id)
            if (deleted_service.rows[0].id) {
                const result = {
                    success: true,
                    data: " Service successfully deleted"
                }
                console.log(deleted_service.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_service.rows.length == 0) {
                const result = new Api404Error('service_id', i18n.__('validation.isExist', `service_id = ${service_id}`))
                console.log(result, ' ----> err in deleteService function with service_id = ${service_id} not exists at service_contrpller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteService function at service_contrpller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Получить одно удобство ###
    async retrieveSingleService(req, res) {
        try {
            const service_id = req.params.serviceId
            const one_service = await servicemodel.findOne(service_id)
            if (one_service.rows[0]) {
                const result = {
                    "success": true,
                    "data": one_service.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('service_id', i18n.__('validation.isExist', `service_id = ${service_id}`))
                console.log(result, ` -----> err in retrieveSingleService function with service_id = ${service_id} not exists at service_contrpller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleService function at service_contrpller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Получить все удобства ###
    async retrieveMultipleServices(req, res) {
        try {
            const { state, sortBy, size, page, s } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_services = await servicemodel.findAll({ state, sortBy, limit, offset, s })
            // console.log(all_services)

            if (all_services[0].rows.length !== 0) {
                console.log(all_services[0].rows, all_services[1].rows)
                const pagination = getPagingData(all_services, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": all_services[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('service_name', i18n.__('validation.isExist', `${s}`))
                console.log(result, ` -----> err in retrieveMultipleServices function  with  ${s} not exists at service_contrpller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleServices function at service_contrpller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

}

const service_controller = new ServiceControlller();
export { service_controller };