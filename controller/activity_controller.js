import { activity } from '../models/activity_model.js';
import { validationResult } from 'express-validator';
import i18n from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from '../enums/http_status_codes_enums.js';
import { getPagination, getPagingData } from './_pagination.js';
// console.log( i18n, " ---> i18n in the activity_controller.js")


class ActivityController {

    //  ### Activity

    validationSchema = {

        activityId: {
            // The location of the field, can be one or more of body, cookies, headers, params or query.
            // If omitted, all request locations will be checked
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: activityId => {
                    return activityId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'activityId') },
                bail: true,
            },
            custom: {
                options: (activityId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return activity.isExist(activityId).then(is_exist => {
                            console.log(is_exist, '-------> is_exist activity from validationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Activity with activity_id = ${activityId} is not in DB (from activity_controller.js)')
                                return Promise.reject('404 ' + i18n.__('validation.isExist', `activity_id = ${activityId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in validationSchema at activity_conrtoller.js")
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

        activity_name: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'activity_name') },
                bail: true,
            },
            custom: {
                options: (value, { req, location, path }) => {
                    console.log(value, req, "----> req.params.activityId")
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return activity.isUnique(value).then(is_unique => {
                            console.log(is_unique, '-------> is_unique activity from validationSchema')

                            if (is_unique.rows[0].exists == true) {
                                console.log('Activity with activity_name = ${value} is not in DB (from activity_controller.js)')
                                return Promise.reject(i18n.__('validation.isUnique', `activity_name '${value}'`));
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
                                        "activity_name": err.data,
                                    }
                                }
                                console.log(server_error, " ------------------> Server Error in validationSchema at activity_conrtoller.js")
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
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'activity_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'activity_name') },
                options: { min: 2, max: 100 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        active: {
            in: ['body'],
            optional: true,
            notEmpty: {
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
                options: [['activity_id', 'activity_name']],
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
                    console.log(not_found_error, ` ----> not_found_error from the ActivityController.checkResult`)
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                } else {
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ----> bad_request_error from the ActivityController.checkResult`)
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            } else {
                const server_error = data
                console.log(server_error, ` ----> server_error from the ActivityController.checkResult`)
                res.status(server_error.statusCode || 500).json(server_error)
            }
        } else {
            return next()
        }
    }

    async createActivity(req, res) {
        const { activity_name } = req.body
        try {
            const new_activity = await activity.create(activity_name)
            if (new_activity.rows[0].id) {
                const result = {
                    success: true,
                    data: " Activity successfully created"
                }
                console.log(new_activity.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error('activity_name', 'Unhandled Error')
                console.log(result, ' ----> err from createActivity function at activity_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in createActivity function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateActivity(req, res) {
        const activity_id = req.params.activityId
        const { activity_name } = req.body
        try {
            const updated_activity = await activity.update(activity_id, activity_name)
            if (updated_activity.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Activity successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updated_activity.rows, result)
            } else {
                const result = new Api404Error('activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`))
                console.log(result, ' ----> err from updateActivity function at activity_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateActivity function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activateActivity(req, res) {
        try {
            const activity_id = req.params.activityId
            const { active } = req.body
            console.log(activity_id, typeof (activity_id))
            // console.log( "------> controller is working in the activateActivity")     
            const activated_activity = await activity.activate(activity_id, active)
            console.log(activated_activity, " ----> activated_activity in activateActivity")
            if (activated_activity.rows.length == 0) {
                const result = new Api404Error('activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`))
                console.log(result, ` ----> err in activateActivity function with activity_id = ${activity_id} not exists at activity_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_activity.rows[0].active == false) {
                const result = {
                    success: true,
                    data: " Activity successfully deactivated"
                }
                console.log(activated_activity.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (activated_activity.rows[0].active == true) {
                const result = {
                    success: true,
                    data: " Activity successfully activated"
                }
                console.log(activated_activity.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateActivity function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteActivity(req, res) {
        try {
            const activity_id = req.params.activityId
            const deleted_activity = await activity.delete(activity_id)
            if (deleted_activity.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Activity successfully deleted"
                }
                console.log(deleted_activity.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_activity.rows.length == 0) {
                const result = new Api404Error('activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`))
                console.log(result, ' ----> err in deleteActivity function with activity_id = ${activity_id} not exists at activity_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteActivity function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }
    // Поисковые запросы

    async retrieveSingleActivity(req, res) {
        const activity_id = req.params.activityId
        try {
            const get_activity = await activity.findOne(activity_id)
            if (get_activity.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": get_activity.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('activity_id', i18n.__('validation.isExist', `activity_id = ${activity_id}`))
                console.log(result, ` -----> err in retrieveSingleActivity function with activity_id = ${activity_id} not exists at activity_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleActivity function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleActivities(req, res) {
        try {
            // console.log(req.query)
            const { state, sortBy, size, page, s } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const get_activities = await activity.findAll({ state, sortBy, limit, offset, s })
            console.log(get_activities)

            if (get_activities[0].rows.length !== 0) {
                console.log(get_activities[0].rows, get_activities[1].rows)
                const pagination = getPagingData(get_activities, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": get_activities[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('activity_name', i18n.__('validation.isExist', `${s}`))
                console.log(result, ` -----> err in retrieveMultipleActivities function  with  ${s} not exists at activity_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleActivities function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrievePopularActivities(req, res) {
        try {
            const popular_activities = await activity.findPopular()
            if (popular_activities.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": popular_activities.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('retrievePopularActivities', i18n.__('validation.isExist', 'getPopularActivities'))
                console.log(result, ` -----> err in retrievePopularActivities function  at activity_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----->err in retrievePopularActivities function at activity_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }
}

const activity_controller = new ActivityController();
export { activity_controller }



