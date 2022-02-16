import { feedbackmodel } from '../models/feedback_model.js';
import { providermodel } from '../models/provider_model.js';
import { messagethreadmodel } from '../models/messagethread_model.js';
import { validationResult } from 'express-validator';
import i18n from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import httpStatusCodes from '../enums/http_status_codes_enums.js';
import { getPagination, getPagingData } from './_pagination.js';


class FeedbackController {
    validationSchema = {

        feedbackId: {
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: feedbackId => {
                    return feedbackId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'feedbackId') },
                bail: true,
            },
            custom: {
                options: (feedbackId, { req, location, path }) => {

                    return feedbackmodel.isExist(feedbackId).then(is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows in feedbackId of feedback from validationSchema')

                        if (is_exist.rows[0].exists == false) {
                            // console.log('Feedback with feedback_id = ${feedbackId} is not in DB (from feedback_controller.js)')
                            return Promise.reject('404 ' + i18n.__('validation.isExist', `feedback_id = ${feedbackId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
                            return Promise.reject(server_error)
                        } else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        provider_id: {

            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {
                errorMessage: () => { return i18n.__('validation.isInt', 'provider_id') },
                bail: true,
            },
            custom: {
                options: (provider_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows in provider_id of feedback from validationSchema')

                            if (is_exist.rows[0].exists == false) {
                                return Promise.reject('404 Error;' + i18n.__('validation.isExist', `provider_id = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
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
        messagethread_id: {
            in: ['body'],
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'messagethread_id') },
                bail: true,
            },
            isInt: {
                errorMessage: () => { return i18n.__('validation.isInt', 'messagethread_id') },
                bail: true,
            },
            custom: {
                options: (messagethread_id, { req, location, path }) => {

                    return messagethreadmodel.isExist(messagethread_id).then(is_exist => {
                        console.log(is_exist.rows, '-------> is_exist.rows in messagethread_id of feedback from validationSchema')

                        if (is_exist.rows[0].exists == false) {
                            // console.log('Feedback with messagethread_id = ${messagethread_id} is not in DB (from feedback_controller.js)')
                            return Promise.reject('404 Error; ' + i18n.__('validation.isExist', `messagethread_id = ${messagethread_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        } else {
                            const provider_id = req.body.provider_id
                            return feedbackmodel.isUniqueCombination(provider_id, messagethread_id).then(is_unique => {
                                console.log(is_unique.rows, '-------> is_unique.rows in feedback from validationSchema')
                                if (is_unique.rows[0].exists == true) {
                                    return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & messagethread_id = ${messagethread_id}`));
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
                                            "provider_id": err.data,
                                        }
                                    }
                                    console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
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
                            console.log(server_error, " ------------------> Server Error in validationSchema at feedback_conrtoller.js")
                            return Promise.reject(server_error)
                        } else {
                            const msg = err
                            return Promise.reject(msg)
                        };
                    })
                },
            },
        },

        is_active: {

            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'is_active') },
                bail: true,
            },
            isBoolean: {
                errorMessage: () => { return i18n.__('validation.isBoolean', 'is_active') },
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
                options: [['feedback_id', 'messagethread_id']],
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
            isInt: {
                options: { min: 1, max: 10000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'page') },
                bail: true,
            },
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
                    console.log(not_found_error, ` ----> not_found_error from the FeedbackController.checkResult`)
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                } else {
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ----> bad_request_error from the FeedbackController.checkResult`)
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            } else {
                const server_error = data
                console.log(server_error, ` ----> server_error from the FeedbackController.checkResult`)
                res.status(server_error.statusCode || 500).json(server_error)
            }
        } else {
            return next()
        }
    }

    async createFeedback(req, res) {
        try {
            const { provider_id, messagethread_id } = req.body
            const new_feedback = await feedbackmodel.create(provider_id, messagethread_id)
            if (new_feedback.rows[0]) {
                const result = {
                    success: true,
                    data: " Feedback successfully created"
                }
                console.log(new_feedback.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api400Error('provider_id', 'Unhandled Error')
                console.log(result, ' ----> err from createFeedback function at feedback_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in createFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateFeedback(req, res) {
        try {
            const feedback_id = req.params.feedbackId
            const { provider_id, messagethread_id } = req.body
            const updated_feedback = await feedbackmodel.update(feedback_id, provider_id, messagethread_id)
            if (updated_feedback.rows[0]) {
                const result = {
                    success: true,
                    data: " Feedback successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updated_feedback.rows, result)
            } else {
                const result = new Api404Error('feedback_id', i18n.__('validation.isExist', `feedback_id = ${feedback_id}`))
                console.log(result, ' ----> err from updateFeedback function at feedback_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activateFeedback(req, res) {
        try {
            const feedback_id = req.params.feedbackId
            const { is_active } = req.body
            const activated_feedback = await feedbackmodel.activate(feedback_id, is_active)
            if (activated_feedback.rows.length == 0) {
                const result = new Api404Error('feedback_id', i18n.__('validation.isExist', `feedback_id = ${feedback_id}`))
                console.log(result, ` ----> err in activateFeedback function with feedback_id = ${feedback_id} not exists at feedback_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_feedback.rows[0].active == false) {
                const result = {
                    success: true,
                    data: " Feedback successfully deactivated"
                }
                console.log(activated_feedback.rows, result)
                res.status(httpStatusCodes.OK || 500).json(success)
            } else if (activated_feedback.rows[0].active == true) {
                const result = {
                    success: true,
                    data: " Feedback successfully activated"
                }
                console.log(activated_feedback.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteFeedback(req, res) {
        try {
            const feedback_id = req.params.feedbackId
            const deleted_feedback = await feedbackmodel.delete(feedback_id)
            if (deleted_feedback.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Feedback successfully deleted"
                }
                console.log(deleted_feedback.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else if (deleted_feedback.rows.length == 0) {
                const result = new Api404Error('feedback_id', i18n.__('validation.isExist', `feedback_id = ${feedback_id}`))
                console.log(result, ' ----> err in deleteFeedback function with feedback_id = ${feedback_id} not exists at feedback_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteFeedback function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleFeedbacks(req, res) {
        try {
            const { state, sortBy, size, page, s } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const get_feedbacks = await feedbackmodel.findAll({ state, sortBy, limit, offset, s })
            console.log(get_feedbacks)
            console.log(get_feedbacks[0].rows, get_feedbacks[1].rows)

            if (get_feedbacks[0].rows.length !== 0) {
                console.log(get_feedbacks[0].rows, get_feedbacks[1].rows)
                const pagination = getPagingData(get_feedbacks, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": get_feedbacks[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('feedback_id', i18n.__('validation.isExist', `${s}`))
                console.log(result, ` -----> err in retrieveMultipleFeedbacks function  with  ${s} not exists at feedback_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleFeedbacks function at feedback_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }
}

const feedback_controller = new FeedbackController();
export { feedback_controller }