import { pool } from '../db.js';
import { providermodel } from '../models/provider_model.js';
import { advantagemodel } from '../models/advantage_model.js';
import { timetablemodel } from '../models/timetable_model.js';
import { extratimetablemodel } from '../models/extratimetable_model.js';
import { serviceprovidermodel } from '../models/serviceprovider_model.js';
import { servicemodel } from '../models/service_model.js';
import { promotionmodel } from '../models/promotion_model.js';
import { descriptionmodel } from '../models/description_model.js';
import { equipmentmodel } from '../models/equipment_model.js';
import { equipmentprovidermodel } from '../models/equipmentprovider_model.js';
import { faremodel } from '../models/fare_model.js';
import { user } from '../models/user_model.js';

import { validationResult } from 'express-validator';
import i18n from 'i18n';

import Api400Error from '../errors/api400_error.js';
import Api404Error from '../errors/api404_error.js';
import Api500Error from '../errors/api500_error.js';
import httpStatusCodes from '../enums/http_status_codes_enums.js';
import { getPagination, getPagingData } from './_pagination.js';

import { languages_enums } from '../enums/languages_enums.js';
import { providerstypes_enums } from '../enums/providerstypes_enums.js';
import { recreationalfacilitytypes_enums } from '../enums/recreationalfacilitytypes_enums.js';
import { descriptiontypes_enums } from '../enums/descriptiontypes_enums.js';

const db = pool

class ProviderController {

    //     ### Provider ###

    providerValidationSchema = {

        providerId: {  // для создания
            in: ['params'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from providerValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 Error:   как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in providerValidationSchema at provider_conrtoller.js")
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

        provider_name: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_name') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'provider_name') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'provider_name') },
                options: { min: 1, max: 50 },
                bail: true,
            },
            custom: {
                options: (value, { req, location, path }) => {
                    console.log(value, "----> provider_name")
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return providermodel.isUnique(value).then(is_unique => {
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

        user_id: { // для создания
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'user_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: user_id => {
                    return user_id !== undefined;
                },
                options: { min: 1 },
                errorMessage: () => { return i18n.__('validation.isInt', 'user_id') },
                bail: true,
            },
            custom: {
                options: (user_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return user.isExistUserId(user_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from providerValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('User with user_id = ${user_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `user_id = ${user_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in providerValidationSchema at provider_conrtoller.js")
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

        providertype_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'providertype_id') },
                bail: true,
            },
            // isInt: { 
            //     if: providertype_id => {
            //         return providertype_id !== undefined;
            //     },
            //     options: {
            //         min: 1,
            //         max: 2
            //     },
            //     errorMessage: () => { return i18n.__('validation.isInt', 'providertype_id') },
            //     bail: true,
            // },
            custom: {  // илм custom или isInt выше 
                options: (providertype_id, { req }) => {
                    if (providertype_id in providerstypes_enums) {
                        return true
                    } else {
                        return Promise.reject(i18n.__('validation.isIn', 'providertype_id'))
                    }
                },
            },
        },

        recreationfacilitytype_id: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'recreationfacilitytype_id') },
                bail: true,
            },
            // isInt: {
            //     if: recreationfacilitytype_id => {
            //         return recreationfacilitytype_id !== undefined;
            //     },
            //     options: {
            //         min: 1,
            //         max: 3
            //     },
            //     errorMessage: () => { return i18n.__('validation.isInt', 'recreationfacilitytype_id') },
            //     bail: true,
            // },
            custom: {  // илм custom или isInt выше 
                options: (recreationfacilitytype_id, { req }) => {
                    if (recreationfacilitytype_id in recreationalfacilitytypes_enums) {
                        return true
                    } else {
                        return Promise.reject(i18n.__('validation.isIn', 'recreationfacilitytype_id'))
                    }
                },
            },
        },

        location: {
            in: ['body'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'location') },
                bail: true,
            },
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

        address: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'address') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'address') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'address') },
                options: { min: 1, max: 200 },
                bail: true,
            },
            trim: true,
            escape: true,
        },


        geolocation: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'geolocation') },
                bail: true,
            },
            // isJSON: {
            //     errorMessage: () => { return i18n.__('validation.isJSON', 'geolocation') },
            //     bail: true,
            // },
        },
        'geolocation.coordinates': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'geolocation coordinates') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'geolocation coordinates') },
                bail: true,
            },
            // isLatLong: {  // не работает
            //     errorMessage: () => { return i18n.__('validation.isLatLong', 'geolocation coordinates') },
            //     bail: true,
            // },
        },

        'geolocation.coordinates.*': {  // не работает
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'geolocation coordinates') },
                bail: true,
            },
            isDate: {
                errorMessage: () => { return i18n.__('validation.isLatLong', 'geolocation coordinates') },
                bail: true,
            },
        },

        'geolocation.type': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'geolocation type') },
                bail: true,
            },
            isIn: {
                errorMessage: () => { return i18n.__('validation.isIn', 'geolocation type') },
                options: [['Point', '']],
                bail: true,
            },
        },

        post_index: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'post_index') },
                bail: true,
            },
            // isPostalCode: {  // пропускает все поэтому заменил на isNumeric
            //     errorMessage: () => { return i18n.__('validation.isPostalCode', 'post_index') },
            //     bail: true,
            // },
            isNumeric: {
                errorMessage: () => { return i18n.__('validation.isNumeric', 'post_index') },
                bail: true,
            },
        },

        timetable: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'timetable') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'timetable') },
                bail: true,
            },
            custom: {
                options: (timetable, { req }) => {
                    for (let day = 0; day < timetable.length; day++) {
                        console.log(timetable[day].start_time, day, ' ---> day')
                        const { start_time, end_time } = timetable[day]
                        if (!start_time || !end_time) {
                            console.log(' ----------------->>>>> NOT OK')
                            return Promise.reject(i18n.__('validation.isProvided', 'timetable/  start_time & end_time'))
                        }
                        if (day === timetable.length - 1) {
                            console.log(' ----------------->>>>> OK')
                            return true
                        }
                    }
                },
            },
        },

        'timetable.*.start_time': {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'timetable start_time') },
                bail: true,
            },
        },

        'timetable.*.end_time': {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'timetable end_time') },
                bail: true,
            },
        },

        description: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'description') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'description') },
                bail: true,
            },
            custom: {
                options: (description, { req }) => {
                    for (let i = 0; i < description.length; i++) {
                        console.log(description[i], i, ' ---> description')
                        const { locale, descriptiontype, content } = description[i]
                        if (!locale || !descriptiontype || !content) {
                            console.log('description fields ----------------->>>>> NOT OK')
                            return Promise.reject(i18n.__('validation.isProvided', 'description/  locale, descriptiontype, content'))
                        }
                        if (i === description.length - 1) {
                            console.log('description fields ----------------->>>>> OK')
                            return true
                        }
                    }
                },
                bail: true,
            },
        },

        'description.*.locale': {
            in: ['body'],
            optional: true,
            custom: {
                options: (value, { req }) => {
                    // console.log(languages_enums, ' ----> languages_enums')
                    let existed_locales = []
                    languages_enums.forEach((obj_locale, index, array) => {
                        console.log(value, obj_locale.locale, ' ----> value, locale ')
                        existed_locales.push(obj_locale.locale)
                    })
                    if (existed_locales.includes(value)) {
                        console.log(existed_locales, '  existed_locales ----------------->>>>> OK')
                        return true
                    }
                },
                errorMessage: () => { return i18n.__('validation.isIn', 'locale') },
                bail: true,
            },
        },

        'description.*.descriptiontype': {
            in: ['body'],
            optional: true,
            custom: {
                options: (value) => {
                    if (value in descriptiontypes_enums) {
                        return true
                    }
                },
                errorMessage: () => { return i18n.__('validation.isIn', 'descriptiontype') },
                bail: true,
            },
        },

        'description.*.content': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'content') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'content') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'content') },
                options: { min: 2, max: 500 },
                bail: true,
            },

            trim: true,
            escape: true,
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


            custom: {
                options: (services, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const services = req.body.services
                        const unique_array = new Set(services)
                        if (services.length == unique_array.size) {
                            return true
                        } else {
                            return Promise.reject(i18n.__('validation.isDuplicate', `services = ${services}`));
                        };
                        // Это второй вариант, первый ниже 
                        // Eсли выбрать второй, то первый надо поднять выше для проверки IsInt в массиве services). 
                        // Плюсы - проверяем одним запросом методом  isExistList. 
                        // Минусы - цикл в модели и цикл для проверки пезультатов в контроллере

                        // return servicemodel.isExistList(services).then(result_list => {
                        //     console.log(result_list[0].rows, '-------> result_list[0].rows services from providerValidationSchema')
                        //     for (let i = 0; i < result_list.length; i += 1) {
                        //         if (result_list[i].rows[0].exists === false) {
                        //             console.log(`Services = ${services[i]} is not in DB (from provider_conrtoller.js)`)
                        //             return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `services = ${services[i]}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        //         }
                        //     }
                        // }).catch(err => {
                        //     if (err.error) {
                        //         const server_error = {
                        //             "success": false,
                        //             "error": {
                        //                 "code": err.statusCode,
                        //                 "message": err.error.message,
                        //             },
                        //             "data": err.data,
                        //         }
                        //         console.log(server_error, " ------------------> Server Error in providerValidationSchema at provider_conrtoller.js")
                        //         return Promise.reject(server_error)
                        //     } else {
                        //         const msg = err
                        //         return Promise.reject(msg)
                        //     };
                        // })
                    }
                },
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
            custom: {
                options: (service_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return servicemodel.isExist(service_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows services from providerValidationSchema')
                            if (is_exist.rows[0].exists == false) {
                                console.log(`Services = ${service_id} is not in DB (from provider_conrtoller.js)`)
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `services = ${service_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in providerValidationSchema at provider_conrtoller.js")
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

        equipments: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'equipments') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'equipments') },
                bail: true,
            },
            custom: {
                options: (equipments, { req }) => {
                    for (let i = 0; i < equipments.length; i++) {
                        console.log(equipments[i], i, ' ---> equipments')
                        const { equipment_id, availabilitydate, cancellationdate, quantity, fares } = equipments[i]
                        if (!equipment_id || !availabilitydate || !cancellationdate || !quantity || !fares) {
                            console.log(' equipments fields ----------------->>>>> NOT OK')
                            return Promise.reject(i18n.__('validation.isProvided', 'equipments/  equipment_id, availabilitydate, cancellationdate, quantity, fares'))
                        }
                        if (i === equipments.length - 1) {
                            console.log(' equipments fields ----------------->>>>> OK')
                            return true
                        }
                    }
                },
                bail: true,
            },
        },

        'equipments.*.equipment_id': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'equipments') },
                bail: true,
            },
            isInt: {
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipment_id') },
                bail: true,
            },
            custom: {
                options: (equipment_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return equipmentmodel.isExist(equipment_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from validationSchema')

                            if (is_exist.rows[0].exists == false) {
                                console.log('Equipment with equipment_id = ${equipment_id} is not in DB (from equipment_controller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `equipment_id = ${equipment_id}`));  // злесь 404 Error:   как флаг, который мы проверяем в checkResult()
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

        'equipments.*.availabilitydate': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'availabilitydate') },
                bail: true,
            },
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'availabilitydate') },
                bail: true,
            },
        },

        'equipments.*.cancellationdate': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'cancellationdate') },
                bail: true,
            },
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'cancellationdate') },
                bail: true,
            },
        },

        'equipments.*.content': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'content') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'content') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'content') },
                options: { min: 2, max: 500 },
                bail: true,
            },

            trim: true,
            escape: true,
        },

        'equipments.*.quantity': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'quantity') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 1000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'quantity') },
                bail: true,
            },
        },



        'equipments.*.fares': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'fares') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'fares') },
                bail: true,
            },
            custom: {
                options: (fares, { req }) => {
                    for (let i = 0; i < fares.length; i++) {
                        console.log(fares[i], i, ' ---> fares')
                        const { duration, time_unit, fare, discountnonrefundable } = fares[i]
                        if (!duration || !time_unit || !fare || !discountnonrefundable) {
                            console.log(' fares fields ----------------->>>>> NOT OK')
                            return Promise.reject(i18n.__('validation.isProvided', 'fares/  duration, time_unit, fare, discountnonrefundable'))
                        }
                        if (i === fares.length - 1) {
                            console.log(' fares fields ----------------->>>>> OK')
                            return true
                        }
                    }
                },
                bail: true,
            },
        },

        'equipments.*.fares.*.duration': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'duration') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 365 },
                errorMessage: () => { return i18n.__('validation.isInt', 'duration') },
                bail: true,
            },
        },

        'equipments.*.fares.*.time_unit': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'time_unit') },
                bail: true,
            },
            isIn: {
                options: [['day', 'hour']],
                errorMessage: () => { return i18n.__('validation.isIn', 'time_unit') },
                bail: true,
            },
        },

        'equipments.*.fares.*.fare': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'fare') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 1000000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'fare') },
                bail: true,
            },
        },

        'equipments.*.fares.*.discountnonrefundable': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'discountnonrefundable') },
                bail: true,
            },
            isInt: {
                options: { min: 1, max: 99 },
                errorMessage: () => { return i18n.__('validation.isInt', 'discountnonrefundable') },
                bail: true,
            },
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
        rating: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'rating') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 100 },
                errorMessage: () => { return i18n.__('validation.isInt', 'rating') },
                bail: true,
            },
        },
        distance_from_center: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'distance_from_center') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 10000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'distance_from_center') },
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
                options: [['id', 'user_id', 'rating']],
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
        's.providerName': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'providerName') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'providerName') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'providerName') },
                options: { min: 2, max: 50 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        's.providertypeId': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'providertypeId') },
                bail: true,
            },
            isInt: {
                options: { min: 1, max: 100000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providertypeId') },
                bail: true,
            },
        },

        's.userId': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'userId') },
                bail: true,
            },
            isInt: {
                options: { min: 1, max: 1000000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'userId') },
                bail: true,
            },
        },

        's.location': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'location') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'location') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'location') },
                options: { min: 2, max: 30 },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        's.address': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'address') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'address') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'address') },
                options: { min: 5, max: 200 },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        's.postIndex': {
            in: ['query'],
            optional: true,
            notEmpty: {
                if: value => {
                    return value !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isEmpty', 'postIndex') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'postIndex') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'postIndex') },
                options: { min: 5, max: 7 },
                bail: true,
            },
            trim: true,
            escape: true,
        },
        's.rating': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'rating') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 100 },
                errorMessage: () => { return i18n.__('validation.isInt', 'rating') },
                bail: true,
            },
        },
        's.distanceFromCenter': {
            in: ['query'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'distanceFromCenter') },
                bail: true,
            },
            isInt: {
                options: { min: 0, max: 10000 },
                errorMessage: () => { return i18n.__('validation.isInt', 'rating') },
                bail: true,
            },
        }
    }

    async createProvider(req, res) {
        try {
            const {
                provider_name,
                providertype_id,
                recreationfacilitytype_id,
                user_id,
                timetable,
                geolocation,
                location,
                address,
                post_index,
                equipments,
                services,
                description
            } = req.body

            console.log(
                provider_name,
                providertype_id,
                recreationfacilitytype_id,
                user_id,
                timetable,
                geolocation,
                location,
                address,
                post_index,
                equipments,
                services,
                description
            )

            //  Создание графика работы 

            const new_timetable = await timetablemodel.createNewTimetable(timetable)
            const timetable_id = new_timetable.rows[0].id;
            console.log(new_timetable.rows, timetable_id, "new_timetable")

            //     //  Создание провайдера оказания услуг   

            const new_provider = await providermodel.create(provider_name, user_id, timetable_id, providertype_id,
                recreationfacilitytype_id, location, address, post_index, geolocation)
            const provider_id = new_provider.rows[0].id

            //  Добавление  удобств сoзданному провайдеру

            let added_service = false;
            if (services !== undefined) {
                const services_provider = await serviceprovidermodel.addAllServices(provider_id, services)
                console.log(services_provider.rows, " ---> services_provider.rows in createProvider at provider_controller.js")
                if (services_provider.rows.lenth !== 0) {
                    added_service = true
                } else {
                    const result = new Api500Error('added service', 'Unhandled Error')
                    console.log(result, ' ----> err added service in createProvider function at provider_controller.js')
                    res.status(result.statusCode || 500).json(result)
                }
            }
            console.log(added_service, " ---> added_service at provider_controller.js")

            //  Описание провайдера (descriptions) 

            let added_description = false;
            if (description !== undefined) {
                const new_description = await descriptionmodel.create(provider_id, description)
                console.log(new_description.rows, " ---> new_description.rows in createProvider at provider_controller.js")
                if (new_description.rows.lenth !== 0) {
                    added_description = true
                } else {
                    const result = new Api500Error('added description', 'Unhandled Error')
                    console.log(result, ' ----> err added description in createProvider function at provider_controller.js')
                    res.status(result.statusCode || 500).json(result)
                }
            }
            console.log(added_description, " ---> added_description at provider_controller.js")

            //    Инвентарь от объект отдыха  (equipmentprovider)  И тарификация (fares) 

            let added_equipments = false;
            let added_fares = false;
            var equipments_and_fares = new Promise((resolve, reject) => {
                equipments.forEach(async (equipment) => {
                    const { equipment_id, quantity, availabilitydate, cancellationdate, fares } = equipment
                    const added_equipmentprovider = await equipmentprovidermodel.createNewEquipmentProvider(provider_id, equipment_id, quantity, availabilitydate, cancellationdate)
                    // console.log(equipmentprovider.rows, " ---> new_equipmentprovider.rows in createProvider function  at provider_controller.js") 
                    if (added_equipmentprovider.rows.lenth !== 0) {
                        const equipmentprovider_id = added_equipmentprovider.rows[0].id
                        console.log(added_equipmentprovider.rows, equipmentprovider_id, " ---> added_equipmentprovider.rows in createProvider function  at provider_controller.js")
                        fares.forEach(async (fare_item, index, array) => {
                            const { duration, time_unit, fare, discountnonrefundable } = fare_item
                            const added_fare = await faremodel.createNewFare(equipmentprovider_id, duration, time_unit, fare, discountnonrefundable)
                            console.log(added_fare.rows, ' ----> added_fare.rows  in createProvider function at provider_controller.js')

                            if (index === array.length - 1) {
                                added_equipments = true
                                added_fares = true
                                resolve();
                            }
                        })
                    }
                });
            });

            equipments_and_fares.then(() => {
                console.log(added_equipments, " ---> added_equipments at provider_controller.js")
                console.log(added_fares, " ---> added_fares at provider_controller.js")

                if (added_equipments == true && added_fares == true) {
                    //  AND .... Другие условия
                    const result = {
                        success: true,
                        data: "Provider successfully created"
                    }
                    console.log(result, new_provider.rows, ' -----> new_provider.rows in createProvider function at provider_controller.js')
                    res.status(httpStatusCodes.OK || 200).json(result)
                } else {
                    const result = new Api400Error('create provider', 'Unhandled Error')
                    console.log(result, ' ----> err from createProvider function at provider_controller.js')
                    res.status(result.statusCode || 400).json(result)
                }
            })
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in createProvider function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  createProvider function at provider_controller.js ')
                res.json({ 'Code Error': err.message })
            }
        }
    }

    async updateProvider(req, res) {
        try {
            const {
                provider_name,
                providertype_id,
                recreationfacilitytype_id,
                user_id,
                location,
                address,
                post_index
            } = req.body
            const provider_id = req.params.providerId
            const apdated_provider = await providermodel.update(provider_id, provider_name, providertype_id, recreationfacilitytype_id, user_id, location, address, post_index)
            if (apdated_provider.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Provider successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(apdated_provider.rows, result)
            } else {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', `provider_id = ${provider_id}`))
                console.log(result, ' ----> err from updateProvider function at provider_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activateProvider(req, res) {
        try {
            const { active } = req.body
            const provider_id = req.params.providerId
            console.log(provider_id)
            const activated_provider = await providermodel.activate(provider_id, active)
            if (activated_provider.rowCount == 0) {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', `provider_id  ${provider_id}`))
                console.log(result, ` ----> err in activateProvider function with provider_id ${provider_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_provider.rows[0].active == true) {
                const result = {
                    success: true,
                    data: " Provider successfully activated"
                }
                console.log(activated_provider.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = {
                    success: true,
                    data: " Provider successfully deactivated"
                }
                console.log(activated_provider.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteProvider(req, res) {
        try {
            const provider_id = req.params.providerId
            console.log(provider_id)
            const deleted_provider = await providermodel.delete(provider_id)
            if (deleted_provider.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Provider successfully deleted"
                }
                console.log(deleted_provider.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', `provider_id = ${provider_id}`))
                console.log(result, ' ----> err in deleteProvider function with provider_id = ${provider_id} not exists at provider_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


    async retrieveSingleProvider(req, res) {
        try {
            const provider_id = req.params.providerId
            console.log(provider_id)
            const provider = await providermodel.findOne(provider_id)
            if (provider.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": provider.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', `provider_id = ${provider_id}`))
                console.log(result, ` -----> err in retrieveSingleProvider function with provider_id = ${provider_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


    async retrieveMultipleProviders(req, res) {
        try {
            const { state, sortBy, size, page, s } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const providers = await providermodel.findAll({ state, sortBy, limit, offset, s })
            console.log(providers)

            if (providers[0].rows.length !== 0) {
                console.log(providers[0].rows, providers[1].rows)
                const pagination = getPagingData(providers, page, limit);
                // console.log(pagination)
                const result = {
                    "success": true,
                    "data": providers[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('retrieve providers', i18n.__('validation.isExist', `${s}`))
                console.log(result, ` -----> err in retrieveMultipleActivities function  not exists at activity_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleProviders function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrievBestProviders(req, res) {
        try {
            const { state, sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, ' -------->>>>>> req.query')
            const providers = await providermodel.findBest({ state, sortBy, limit, offset })
            console.log(providers)

            if (providers[0].rows.length !== 0) {
                // console.log(providers[0].rows, providers[1].rows)
                const pagination = getPagingData(providers, page, limit);
                // console.log(pagination)
                const result = {
                    "success": true,
                    "data": providers[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)



                // const best_providers = await providermodel.findBest()
                // if (best_providers.rows.length !== 0) {
                //     const result = {
                //         "success": true,
                //         "data": best_providers.rows
                //     }
                //     console.log(result)
                //     res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('get best providers', i18n.__('validation.isExist', `best provider`))
                console.log(result, ` -----> err in retrievBestProviders function  at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrievBestProviders function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //     ### Timetable ###   

    timetableValidationSchema = {

        providerId: {  // для создания
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from equipmentproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in equipmentproviderValidationSchema at provider_conrtoller.js")
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

        timetableId: {  // для создания
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'timetableId') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'timetableId') },
                bail: true,
            },
            custom: {
                options: (timetableId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const timetable_id = timetableId
                        return timetablemodel.isExist(timetable_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows timetable from timetableValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('timetable with timetable_id = ${timetable_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error: ' + i18n.__('validation.isExist', `timetable_id = ${timetable_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in timetableValidationSchema at provider_conrtoller.js")
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

        timetable: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'timetable') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'timetable') },
                bail: true,
            },
            custom: {
                options: (timetable, { req }) => {
                    for (let day = 0; day < timetable.length; day++) {
                        console.log(timetable[day].start_time, day, ' ---> day')
                        const { start_time, end_time } = timetable[day]
                        if (!start_time || !end_time) {
                            console.log(' ----------------->>>>> NOT OK')
                            return Promise.reject(i18n.__('validation.isProvided', 'timetable/  start_time & end_time'))
                        }
                        if (day === timetable.length - 1) {
                            console.log(' ----------------->>>>> OK')
                            return true
                        }
                    }
                },
            },
        },

        'timetable.*.start_time': {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'timetable start_time') },
                bail: true,
            },
        },

        'timetable.*.end_time': {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'timetable end_time') },
                bail: true,
            },
        },
    }

    async createTimetable(req, res) {
        try {
            const { timetable } = req.body
            const new_timetable = await timetablemodel.create(timetable)
            if (new_timetable.rows.length !== 0) {
                const result = {
                    success: true,
                    data: "Timetable successfully created"
                }
                console.log(result, new_timetable.rows, ' -----> new_timetable.rows in createTimetable function at provider_controller.js')
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('create timetable', 'Unhandled Error')
                console.log(result, ' ----> err from createTimetable function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in createTimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


    async updateTimetable(req, res) {
        try {
            const { timetable } = req.body
            const timetable_id = req.params.timetableId
            const updatted_timetable = await timetablemodel.update(timetable_id, timetable)
            if (updatted_timetable.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Timetable successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updatted_timetable.rows, result)
            } else {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', `timetable_id = ${timetable_id}`))
                console.log(result, ' ----> err from updateTimetable function at provider_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in updateTimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteTimetable(req, res) {
        try {
            const timetable_id = req.params.timetableId
            const deleted_timetable = await timetablemodel.delete(timetable_id)
            if (deleted_timetable.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Timetable successfully deleted"
                }
                console.log(deleted_timetable.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('timetable_id', i18n.__('validation.isExist', `timetable_id = ${timetable_id}`))
                console.log(result, ' ----> err in deleteProvider function with timetable_id = ${timetable_id} not exists at provider_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in deleteTimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async getTimetable(req, res) {
        try {
            const timetable_id = req.params.timetableId
            const one_timetable = await timetablemodel.get(timetable_id)
            if (one_timetable.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": one_timetable.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('timetable_id', i18n.__('validation.isExist', `timetable_id = ${timetable_id}`))
                console.log(result, ` -----> err in getTimetable function with timetable_id = ${timetable_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in getTimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


    //     ### Extratimetable ###

    extratimetableValidationSchema = {

        providerId: {  // для создания
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from extratimetableValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error: ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in extratimetableValidationSchema at provider_conrtoller.js")
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

        extradateId: {  // для создания
            in: ['params'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'extradateId') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'extradateId') },
                bail: true,
            },
            custom: {
                options: (extradateId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const extratimetable_id = extradateId
                        return extratimetablemodel.isExist(extratimetable_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows Extratimetable from extratimetableValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Extratimetable with extratimetable_id = ${extratimetable_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error: ' + i18n.__('validation.isExist', `extratimetable_id = ${extratimetable_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in extratimetableValidationSchema at provider_conrtoller.js")
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

        date: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'availabilitydate') },
                bail: true,
            },
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'availabilitydate') },
                bail: true,
            },
        },

        start_time: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'Extratimetable start_time') },
                bail: true,
            },
        },

        end_time: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'Extratimetable end_time') },
                bail: true,
            },
            isAfter: {
                options: this.start_time,
                errorMessage: () => { return i18n.__('validation.isAfter', 'end_time', 'start_time') },
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
                options: [['id', 'extradate_id']],
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
    }

    async createExtratimetable(req, res) {
        try {
            console.log('Test')
            const { date, start_time, end_time } = req.body
            const provider_id = req.params.providerId
            const new_extratimetable = await extratimetablemodel.create(provider_id, date, start_time, end_time)
            if (new_extratimetable.rows.length !== 0) {
                const result = {
                    success: true,
                    data: "Extratimetable successfully created"
                }
                console.log(new_extratimetable.rows, result, ' -----> new_extratimetable.rows in createExtratimetable function at provider_controller.js')
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('create extratimetable', 'Unhandled Error')
                console.log(result, ' ----> err from createExtratimetable function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in createTimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updateExtratimetable(req, res) {
        try {
            console.log('Test')
            const { date, start_time, end_time } = req.body
            const provider_id = req.params.providerId
            const extratimetable_id = req.params.extradateId
            const updatad_extratimetable = await extratimetablemodel.update(extratimetable_id, provider_id, date, start_time, end_time)
            if (updatad_extratimetable.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Extratimetable successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updatad_extratimetable.rows, result)
            } else {
                const result = new Api404Error('extratimetable_id', i18n.__('validation.isExist', `extratimetable_id = ${extratimetable_id}`))
                console.log(result, ' ----> err from updateExtratimetable function at provider_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in updateExtratimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteExtratimetable(req, res) {
        try {
            console.log('Test')
            const extratimetable_id = req.params.extradateId
            const deleted_extratimetable = await extratimetablemodel.delete(extratimetable_id)
            if (deleted_extratimetable.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Extratimetable successfully deleted"
                }
                console.log(deleted_extratimetable.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('extratimetable_id', i18n.__('validation.isExist', `extratimetable_id = ${extratimetable_id}`))
                console.log(result, ' ----> err in deleteExtratimetable function with extratimetable_id = ${extratimetable_id} not exists at provider_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in deleteExtratimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveSingleExtratimetable(req, res) {
        try {
            console.log('Test')
            const extratimetable_id = req.params.extradateId

            const one_extratimetable = await extratimetablemodel.getOne(extratimetable_id)
            if (one_extratimetable.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": one_extratimetable.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('extratimetable_id', i18n.__('validation.isExist', `extratimetable_id = ${extratimetable_id}`))
                console.log(result, ` -----> err in retrieveSingleExtratimetable function with extratimetable_id = ${extratimetable_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleExtratimetable function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleExtratimetables(req, res) {
        try {
            const s = req.params.providerId
            const { sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_extratimetable = await extratimetablemodel.findAll({ sortBy, limit, offset, s })
            console.log(all_extratimetable)

            if (all_extratimetable[0].rows.length !== 0) {
                console.log(all_extratimetable[0].rows, all_extratimetable[1].rows)
                const pagination = getPagingData(all_extratimetable, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": all_extratimetable[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('get all extratimetable', i18n.__('validation.isExist', ` extratimetable `))
                console.log(result, ` -----> err in retrieveMultiplePromotions function with extratimetable_id = ${s} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }

        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleExtratimetables function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    // ####  Инвентарь от объект отдыха  (equipmentprovider) ###

    equipmentproviderValidationSchema = {

        providerId: {  // для создания
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from equipmentproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in equipmentproviderValidationSchema at provider_conrtoller.js")
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

        equipmentId: {  // для активации и обновления
            in: ['params'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipmentId') },
                bail: true,
            },
            custom: {
                options: (equipmentId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const equipmentprovider_id = equipmentId
                        return equipmentprovidermodel.isExist(equipmentprovider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from equipmentproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Equipment with equipmentprovider_id = ${equipmentId} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `equipmentprovider_id = ${equipmentId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in equipmentproviderValidationSchema at provider_conrtoller.js")
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

        equipment_id: { // для создания
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: equipment_id => {
                    return equipment_id !== undefined;
                },
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipment_id') },
                bail: true,
            },
            custom: {
                options: (equipment_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return equipmentmodel.isExist(equipment_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from equipmentproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Equipment with equipmentprovider_id = ${equipmentId} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `equipmentprovider_id = ${equipmentId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            } else {
                                const provider_id = req.params.providerId
                                return equipmentprovidermodel.isUniqueCombination(provider_id, equipment_id).then(is_unique => {
                                    console.log(is_unique.rows, '-------> is_unique.rows in Equipment from equipmentproviderValidationSchema')
                                    if (is_unique.rows[0].exists == true) {
                                        return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & equipment_id = ${equipment_id}`));
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
                                        console.log(server_error, " ------------------> Server Error in equipmentproviderValidationSchema at provider_conrtoller.js")
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
                                console.log(server_error, " ------------------> Server Error in equipmentproviderValidationSchema at provider_conrtoller.js")
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

        quantity: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'quantity') },
                bail: true,
            },
            isInt: {
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'quantity') },
                bail: true,
            },
        },

        availabilitydate: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'availabilitydate') },
                bail: true,
            },
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'availabilitydate') },
                bail: true,
            },
        },

        cancellationdate: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'cancellationdate') },
                bail: true,
            },
            isDate: {
                errorMessage: () => { return i18n.__('validation.isDate', 'cancellationdate') },
                bail: true,
            },
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
                options: [['id', 'equipmentprovider_id', 'equipment_id']],
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
    }

    async createEquipmentProvider(req, res) {
        try {
            console.log('Test')
            const {
                equipment_id,
                quantity,
                availabilitydate,
                cancellationdate,
            } = req.body
            const provider_id = req.params.providerId
            const new_equipments = await equipmentprovidermodel.create(provider_id, equipment_id, quantity, availabilitydate, cancellationdate)
            if (new_equipments.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Equipment successfully added to Provider"
                }
                console.log(result, new_equipments.rows, ' -----> new_equipments.rows in createEquipmentProvider function at provider_controller.js')
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('equipment to provider', 'Unhandled Error')
                console.log(result, ' ----> err from createEquipmentProvider function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in createEquipmentProvider function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  createEquipmentProvider function at provider_controller.js ')
                res.json({ 'Code Error': err.message })
            }
        }
    }

    async updateEquipmentProvider(req, res) {
        try {
            const {
                equipment_id, // нужен
                quantity,
                availabilitydate,
                cancellationdate
            } = req.body
            const equipmentprovider_id = req.params.equipmentId  //  equipmentId  в запросе  /provider/:providerId/equipment/:equipmentId это на самом деле equipmentprovider_id в коде
            const provider_id = req.params.providerId
            const new_equipments = await equipmentprovidermodel.update(equipmentprovider_id, provider_id, equipment_id, quantity, availabilitydate, cancellationdate)
            // console.log(new_equipments)
            if (new_equipments.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Equipment of Provider successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(result, new_equipments.rows, ' -----> new_equipments.rows in updateEquipmentProvider function at provider_controller.js')
            } else {
                const result = new Api404Error('equipmentId', i18n.__('validation.isExist', `equipmentId = ${equipmentprovider_id}`))
                console.log(result, ' ----> err from updateEquipmentProvider function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateEquipmentProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activateEquipmentProvider(req, res) {
        try {
            // console.log(req.params.equipmentId)
            const { active } = req.body
            const equipmentprovider_id = req.params.equipmentId
            const activated_equipmentprovider = await equipmentprovidermodel.activate(equipmentprovider_id, active)
            if (activated_equipmentprovider.rows.length == 0) {
                const result = new Api404Error('equipmentId', i18n.__('validation.isExist', `equipmentId = ${equipmentprovider_id}`))
                console.log(result, ` ----> err in activateEquipmentProvider function with equipmentprovider_id = ${updateEquipmentProvider} not exists at provider_controller.js;`)
                res.status(result.statusCode || 404).json(result)
            } else if (activated_equipmentprovider.rows[0].active == false) {
                const result = {
                    success: true,
                    data: " Equipment of Provider successfully deactivated"
                }
                console.log(result, activated_equipmentprovider.rows, '-----> activated_equipmentprovider.rows in activateEquipmentProvider function at provider_controller.js ')
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (activated_equipmentprovider.rows[0].active == true) {
                const result = {
                    success: true,
                    data: " Equipment of Provider successfully activated"
                }
                console.log(activated_equipmentprovider.rows, '-----> activated_equipmentprovider.rows in activateEquipmentProvider function at provider_controller.js ')
                res.status(httpStatusCodes.OK || 200).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activateEquipmentProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteEquipmentProvider(req, res) {
        try {
            console.log(req.params.equipmentId)
            const equipmentprovider_id = req.params.equipmentId
            console.log(equipmentprovider_id, "Test delete equipmentprovider")
            const deleted_equipmentprovider = await equipmentprovidermodel.delete(equipmentprovider_id)
            if (deleted_equipmentprovider.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Equipment of Provider successfully deleted"
                }
                console.log(deleted_equipmentprovider.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_equipmentprovider.rows.length == 0) {
                const result = new Api404Error('equipmentId', i18n.__('validation.isExist', `equipmentId = ${equipmentprovider_id}`))
                console.log(result, ' ----> err in deleteEquipmentProvider function with equipmentprovider_id = ${equipmentId} not exists at provider_controller.js;')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteEquipmentProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveSingleEquipmentProvider(req, res) {
        try {
            console.log(req.params.equipmentId)
            const equipmentprovider_id = req.params.equipmentId
            console.log(equipmentprovider_id, "Test equipmentprovider")
            const one_equipmentprovider = await equipmentprovidermodel.findOne(equipmentprovider_id)
            if (one_equipmentprovider.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": one_equipmentprovider.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api404Error('equipmentId', i18n.__('validation.isExist', `equipmentId = ${equipmentprovider_id}`))
                console.log(result, ` -----> err in retrieveSingleEquipmentProvider function  with equipmentprovider_id = ${equipmentprovider_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 400).json(result)   //  в отвере не надо отправлять "data"  на get запрос, если, сущность не найдена
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleEquipmentProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleEquipmentProvider(req, res) {
        try {
            const s = req.params.providerId
            const { state, sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_equipmentprovider = await equipmentprovidermodel.findAll({ state, sortBy, limit, offset, s })
            console.log(all_equipmentprovider)

            if (all_equipmentprovider[0].rows.length !== 0) {
                console.log(all_equipmentprovider[0].rows, all_equipmentprovider[1].rows)
                const pagination = getPagingData(all_equipmentprovider, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": all_equipmentprovider[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('retrieve multiple equipmentproviders', i18n.__('validation.isExist', ` promotion `))
                console.log(result, ` -----> err in retrieveMultiplePromotions function with equipmentprovider_id = ${s} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleEquipmentProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ###  Тарификация (fares)  ###

    fareValidationSchema = {

        equipmentId: {  // для создания тарификации
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'equipment_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipment_id') },
                bail: true,
            },
            custom: {
                options: (equipmentId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const equipmentprovider_id = equipmentId
                        return equipmentprovidermodel.isExist(equipmentprovider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from fareValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Equipment with equipmentprovider_id = ${equipmentprovider_id} is not in DB (from fareValidationSchema)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `equipmentId = ${equipmentprovider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in fareValidationSchema at provider_conrtoller.js")
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

        fareId: {  // для обновления
            in: ['params'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'fareId') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'fareId') },
                bail: true,
            },
            custom: {
                options: (fare_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return faremodel.isExist(fare_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows fare from fareValidationSchema')

                            if (is_exist.rows[0].exists == false) {
                                console.log('Fare with fare_id = ${fare_id} is not in DB (from fareValidationSchema)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `fareId = ${fare_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in fareValidationSchema at provider_conrtoller.js")
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

        duration: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'duration') },
                bail: true,
            },
            isInt: {
                options: {
                    min: 0,
                    max: 100
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'duration') },
                bail: true,
            },
        },

        time_unit: {  // в БД это (var char 4) day / hour
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'time_unit') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'time_unit') },
                options: { min: 3, max: 4 },
                bail: true,
            },
            isIn: {
                errorMessage: () => { return i18n.__('validation.isIn', 'time_unit') },
                options: [['hour', 'day']],
                bail: true,
            },
            custom: {
                options: (time_unit, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else if (req.method == 'PATCH') {
                        const equipment_id = req.params.equipmentId
                        const duration = req.body.duration
                        const fare_id = req.params.fareId
                        return faremodel.isUniqueCombinationForUpdate(fare_id, equipment_id, duration, time_unit).then(is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows Fare from fareValidationSchema')
                            if (is_unique.rows[0].exists == true) {
                                return Promise.reject(i18n.__('validation.isUniqueCombination', ` equipmentId = ${equipment_id} AND duration = ${duration} AND time_unit = ${time_unit}`));
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
                                console.log(server_error, " ------------------> Server Error in fareValidationSchema at provider_conrtoller.js")
                                return Promise.reject(server_error)
                            } else {
                                const msg = err
                                return Promise.reject(msg)
                            };
                        })
                    } else {
                        const equipment_id = req.params.equipmentId
                        const duration = req.body.duration
                        return faremodel.isUniqueCombinationForCreate(equipment_id, duration, time_unit).then(is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows Fare from fareValidationSchema')
                            if (is_unique.rows[0].exists == true) {
                                return Promise.reject(i18n.__('validation.isUniqueCombination', ` equipmentId = ${equipment_id} AND duration = ${duration} AND time_unit = ${time_unit}`));
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
                                console.log(server_error, " ------------------> Server Error in fareValidationSchema at provider_conrtoller.js")
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
        fare: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'fare') },
                bail: true,
            },
            isInt: {
                options: {
                    min: 0,
                    max: 1000000 // копейки
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'fare') },
                bail: true,
            },
        },

        discountnonrefundable: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'discountnonrefundable') },
                bail: true,
            },
            isInt: {
                options: {
                    min: 1,
                    max: 99
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'discountnonrefundable') },
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
                options: [['id', 'fare_id', 'time_unit']],
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

    }
    async createFare(req, res) {
        try {
            const { duration, time_unit, fare, discountnonrefundable } = req.body
            const equipmentprovider_id = req.params.equipmentId
            const new_fare = await faremodel.createNewFare(equipmentprovider_id, duration, time_unit, fare, discountnonrefundable)
            if (new_fare.rows[0].id) {
                const result = {
                    success: true,
                    data: " Fare successfully created"
                }
                console.log(result, new_fare.rows, ' -----> new_fare.rows in createFare function at provider_controller.js')
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('create fare', 'Unhandled Error')
                console.log(result, ' ----> err from createFare function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in createFare function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  createFare function at provider_controller.js ')
                res.json({ 'Code Error': err.message })
            }
        }
    }

    async updateFare(req, res) {
        try {
            const { duration, time_unit, fare, discountnonrefundable } = req.body
            const fare_id = req.params.fareId
            const equipmentprovider_id = req.params.equipmentId
            console.log(fare_id, equipmentprovider_id)

            const updated_fare = await faremodel.updateNewFare(fare_id, equipmentprovider_id, duration, time_unit, fare, discountnonrefundable)
            if (updated_fare.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Fare successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(result, updated_fare.rows, ' -----> updated_fare.rows in updateFare function at provider_controller.js')
            } else {
                const result = new Api404Error('fareId', i18n.__('validation.isExist', `fare_id = ${fare_id}`))
                console.log(result, ' ----> err from updateFare function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateFare function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


    // async updateFare (req, res) { // 2  способ через DELET
    //     try {
    //         const {duration, time_unit, fare} = req.body
    //         const fare_id = req.params.fareId
    //         const equipmentprovider_id = req.params.equipmentId
    //         console.log(equipmentprovider_id)
    //         const deleted_fare = await faremodel.deleteOneFare(fare_id)              

    //         if (deleted_fare.rows.length !== 0) {
    //             const updated_fare = await faremodel.createNewFare (equipmentprovider_id, duration, time_unit, fare)              
    //             if (updated_fare.rows.length !== 0 ) {
    //                 const result = {
    //                     success: true,
    //                     data: " Fare successfully updated"
    //                 }
    //                 console.log(result, updated_fare.rows, ' -----> updated_fare.rows in updateFare function at provider_controller.js')
    //                 res.status(httpStatusCodes.OK || 200).json(result)
    //             } else {
    //                 const result = new Api400Error('update fare', 'Unhandled Error')
    //                 console.log(result, ' ----> err from updateFare function at provider_controller.js')
    //                 res.status(result.statusCode || 400).json(result)
    //             }
    //         } else if (deleted_fare.rows.length == 0) {
    //             const result = new Api404Error('fareId', i18n.__('validation.isExist', `fareId = ${fare_id}`))
    //             console.log(result, ' ----> err in updateFare function with fareId = ${fare_id} not exists at provider_controller.js;')
    //             res.status(result.statusCode || 400).json(result)
    //         }
    //     } catch (err) {
    //         console.error({ err }, '-----> err in updateFare function at provider_controller.js ')
    //         res.status(err.statusCode || 500).json(err)
    //     }
    // }

    async deleteFare(req, res) {
        try {
            const fare_id = req.params.fareId
            console.log(fare_id)
            const deleted_fare = await faremodel.deleteOneFare(fare_id)
            if (deleted_fare.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Fare successfully deleted"
                }
                console.log(deleted_fare.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_fare.rows.length == 0) {
                const result = new Api404Error('fareId', i18n.__('validation.isExist', `fareId = ${fare_id}`))
                console.log(result, ' ----> err in deleteFare function with fareId = ${fare_id} not exists at provider_controller.js;')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteFare function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }


    async retrieveSingleFare(req, res) {
        try {
            const fare_id = req.params.fareId
            console.log(fare_id)
            const one_fare = await faremodel.findOne(fare_id)
            if (one_fare.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": one_fare.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api404Error('retrieve single fare', i18n.__('validation.isExist', `fareId = ${fare_id}`))
                console.log(result, ` -----> err in retrieveSingleFare function not exists at provider_controller.js;`)
                res.status(result.statusCode || 400).json(result)   //  в отвере не надо отправлять "data"  на get запрос, если, сущность не найдена
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleFare function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleFares(req, res) {
        try {
            const s = req.params.equipmentId
            const { state, sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_promotion = await faremodel.findAll({ state, sortBy, limit, offset, s })
            console.log(all_promotion)

            if (all_promotion[0].rows.length !== 0) {
                console.log(all_promotion[0].rows, all_promotion[1].rows)
                const pagination = getPagingData(all_promotion, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": all_promotion[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('retrieve multiple fares', i18n.__('validation.isExist', ` promotion `))
                console.log(result, ` -----> err in retrieveMultipleFares function with equipmentprovider_id = ${s} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleFares function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //     ### Promotion ###

    promotionValidationSchema = {

        providerId: {
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from promotionsValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in promotionsValidationSchema at provider_conrtoller.js")
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
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'equipmentId') },
                bail: true,
            },
            custom: {
                options: (equipmentId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const equipmentprovider_id = equipmentId
                        return equipmentprovidermodel.isExist(equipmentprovider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows equipment from promotionsValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Equipment with equipmentprovider_id = ${equipmentId} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `equipmentprovider_id = ${equipmentId}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in promotionsValidationSchema at provider_conrtoller.js")
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

        promotionId: {
            in: ['params'],
            optional: true,
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                errorMessage: () => { return i18n.__('validation.isInt', 'promotionId') },
                bail: true,
            },
            custom: {
                options: (promotionId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const promotion_id = promotionId
                        return promotionmodel.isExist(promotion_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows Promotion from promotionsValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Promotion with promotion_id = ${promotion_id} is not in DB (from provider_controller.js)')
                                return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `promotion_id = ${promotion_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }  // если exists == true, то валидация прошла, если нет то ловим 404
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
                                console.log(server_error, " ------------------> Server Error in promotionsValidationSchema at provider_controller.js")
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

        title: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'title') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'title') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'title') },
                options: { min: 2, max: 500 },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        discount: {
            in: ['body'],
            optional: true,
            isInt: {
                options: {
                    min: 1,
                    max: 100
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'discount') },
                bail: true,
            },
        },

        booking_start: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'booking_start') },
                bail: true,
            },
            isAfter: {
                errorMessage: () => { return i18n.__('validation.isAfter', 'activity_start', 'now') },
                bail: true,
            },
        },

        booking_end: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'booking_end') },
                bail: true,
            },
            isAfter: {
                options: this.booking_start,
                errorMessage: () => { return i18n.__('validation.isAfter', 'booking_end', 'booking_start') },
                bail: true,
            },
        },

        activity_start: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'activity_start') },
                bail: true,
            },
            isAfter: {
                options: this.booking_start,
                errorMessage: () => { return i18n.__('validation.isAfter', 'activity_start', 'booking_start') },
                bail: true,
            },
        },

        activity_end: {
            in: ['body'],
            optional: true,
            isISO8601: {
                errorMessage: () => { return i18n.__('validation.isISO8601', 'activity_end') },
                bail: true,
            },
            isAfter: {
                options: this.activity_start,
                errorMessage: () => { return i18n.__('validation.isAfter', 'activity_end', 'activity_start') },
                bail: true,
            },
        },
        is_active: {
            in: ['body'],
            optional: true,
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
                options: [['id', 'user_id', 'rating']],
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
    }

    async createPromotion(req, res) {
        try {
            console.log('Test')
            const { title, discount, booking_start, booking_end, activity_start, activity_end } = req.body
            const equipmentprovider_id = req.params.equipmentId
            const new_promotion = await promotionmodel.create(equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end)
            if (new_promotion.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": new_promotion.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api404Error('create promotion', i18n.__('validation.isExist', `equipmentprovider_id =${equipmentprovider_id}`))
                console.log(result, ` -----> err in createPromotion function  at provider_controller.js;`)
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in createPromotion function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async updatePromotion(req, res) {
        try {
            console.log('Test')
            const promotion_id = req.params.promotionId
            const equipmentprovider_id = req.params.equipmentId
            const { title, discount, booking_start, booking_end, activity_start, activity_end } = req.body
            const updatad_promotion = await promotionmodel.update(promotion_id, equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end)
            if (updatad_promotion.rows.length !== 0) {
                const result = {
                    success: true,
                    data: "Promotion successfully updated"
                }
                res.status(httpStatusCodes.OK || 500).json(result)
                console.log(updatad_promotion.rows, result)
            } else {
                const result = new Api404Error('equipmentprovider_id', i18n.__('validation.isExist', `equipmentId = ${equipmentprovider_id}`))
                console.log(result, ' ----> err from updatePromotion function at provider_controller.js')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in updatePromotion function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async activatePromotion(req, res) {
        try {
            const promotion_id = req.params.promotionId
            const { active } = req.body
            console.log('Test', active)
            const activated_promotion = await promotionmodel.activate(promotion_id, active)
            if (activated_promotion.rowCount == 0) {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', `promotionId  ${promotion_id}`))
                console.log(result, ` ----> err in activatePromotion function with promotion_id ${promotion_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            } else if (activated_promotion.rows[0].active == true) {
                const result = {
                    success: true,
                    data: "Promotion successfully activated"
                }
                console.log(activated_promotion.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = {
                    success: true,
                    data: "Promotion successfully deactivated"
                }
                console.log(activated_promotion.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in activatePromotion function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deletePromotion(req, res) {
        try {
            console.log('Test')
            const promotion_id = req.params.promotionId
            const deleted_promotion = await promotionmodel.delete(promotion_id)
            if (deleted_promotion.rows.length !== 0) {
                const result = {
                    success: true,
                    data: "Promotion successfully deleted"
                }
                console.log(deleted_promotion.rows, result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('promotion_id', i18n.__('validation.isExist', `promotionId = ${promotion_id}`))
                console.log(result, ' ----> err in deletePromotion function with promotion_id = ${promotion_id} not exists at provider_controller.js;')
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in deletePromotion function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveSinglePromotion(req, res) {
        try {
            const promotion_id = req.params.promotionId
            console.log('Test', promotion_id)
            const one_promotion = await promotionmodel.findOne(promotion_id)
            if (one_promotion.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": one_promotion.rows[0]
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('promotion_id', i18n.__('validation.isExist', `promotion_id = ${promotion_id}`))
                console.log(result, ` -----> err in retrieveSinglePromotion function with promotion_id = ${promotion_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSinglePromotion function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultiplePromotions(req, res) {
        try {
            const s = req.params.equipmentId
            const { state, sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_promotion = await promotionmodel.findAll({ state, sortBy, limit, offset, s })
            console.log(all_promotion)

            if (all_promotion[0].rows.length !== 0) {
                console.log(all_promotion[0].rows, all_promotion[1].rows)
                const pagination = getPagingData(all_promotion, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": all_promotion[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('retrieve multiple promotions', i18n.__('validation.isExist', ` promotion `))
                console.log(result, ` -----> err in retrieveMultiplePromotions function with equipmentprovider_id = ${s} not exists at provider_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultiplePromotions function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Описание объекта (descriptions) ###

    descriptionValidationSchema = {

        providerId: {
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from descriptionValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in descriptionValidationSchema at provider_conrtoller.js")
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

        descriptionId: {
            in: ['params'],
            optional: true,
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                errorMessage: () => { return i18n.__('validation.isInt', 'descriptionId') },
                bail: true,
            },
            custom: {
                options: (descriptionId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const description_id = descriptionId
                        return descriptionmodel.isExist(description_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows description from descriptionValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Description with description_id = ${description_id} is not in DB (from provider_controller.js)')
                                return Promise.reject('404 Error:  ' + i18n.__('validation.isExist', `description_id = ${description_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            }  // если exists == true, то валидация прошла, если нет то ловим 404
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
                                console.log(server_error, " ------------------> Server Error in descriptionValidationSchema at provider_controller.js")
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

        description: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'description') },
                bail: true,
            },
            isArray: {
                errorMessage: () => { return i18n.__('validation.isArray', 'description') },
                bail: true,
            },
            custom: {
                options: (description, { req }) => {
                    if (req.method == 'PATCH') {
                        return true
                    } else {
                        const provider_id = req.params.providerId
                        for (let i = 0; i < description.length; i++) {

                            if (i === description.length - 1) {
                                console.log('description fields ----------------->>>>> OK')
                                return true
                            } else {
                                console.log(description[i], i, ' ---> description')
                                const { locale, descriptiontype, content } = description[i]
                                if (!locale || !descriptiontype || !content) {
                                    console.log(provider_id, `description fields with provider_id = ${provider_id} ----------->>>>> NOT OK`)
                                    return Promise.reject(i18n.__('validation.isProvided', 'description/  locale, descriptiontype, content'))
                                }

                                return descriptionmodel.isUniqueCombination(provider_id, locale, descriptiontype).then(is_unique => {
                                    console.log(is_unique.rows, '-------> is_unique.rows of profile_id from descriptionValidationSchema')

                                    if (is_unique.rows[0].exists == true) {
                                        return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & locale = ${locale} & descriptiontype = ${descriptiontype}`));
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
                        }
                    }
                },
                bail: true,
            },
        },

        'description.*.locale': {
            in: ['body'],
            optional: true,
            custom: {
                options: (value, { req }) => {
                    // console.log(languages_enums, ' ----> languages_enums')
                    let existed_locales = []
                    languages_enums.forEach((obj_locale, index, array) => {
                        console.log(value, obj_locale.locale, ' ----> value, locale ')
                        existed_locales.push(obj_locale.locale)
                    })
                    if (existed_locales.includes(value)) {
                        console.log(existed_locales, '  existed_locales ----------------->>>>> OK')
                        return true
                    }
                },
                errorMessage: () => { return i18n.__('validation.isIn', 'locale') },
                bail: true,
            },
        },

        'description.*.descriptiontype': {
            in: ['body'],
            optional: true,
            custom: {
                options: (value) => {
                    if (value in descriptiontypes_enums) {
                        return true
                    }
                },
                errorMessage: () => { return i18n.__('validation.isIn', 'descriptiontype') },
                bail: true,
            },
            trim: true,
            escape: true,
        },

        'description.*.content': {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'content') },
                bail: true,
            },
            isString: {
                errorMessage: () => { return i18n.__('validation.isString', 'content') },
                bail: true,
            },
            isLength: {
                errorMessage: () => { return i18n.__('validation.isLength', 'content') },
                options: { min: 2, max: 500 },
                bail: true,
            },
            trim: true,
            escape: true,
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
                options: [['id', 'description_id']],
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
    }

    async createDescription(req, res) {
        try {
            // console.log('Test')
            const description = req.body.description
            const provider_id = req.params.providerId
            const new_description = await descriptionmodel.create(provider_id, description)

            if (new_description.rows.length != 0) {
                const result = {
                    success: true,
                    data: " Description successfully added to Provider"
                }
                console.log(new_description.rows, result, ' -----> new_description.rows in createDescription function at provider_controller.js')
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('description to provider', 'Unhandled Error')
                console.log(result, ' ----> err from createDescription function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in createDescription function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  createDescription function at provider_controller.js ')
                res.json({ 'Code Error': err.message })
            }
        }
    }


    async updateDescription(req, res) {
        try {
            const description = req.body.description
            const provider_id = req.params.providerId
            await descriptionmodel.deleteAll(provider_id)

            const updated_description = await descriptionmodel.create(provider_id, description)
            console.log(updated_description.rows)

            if (updated_description.rows.length != 0) {
                const result = {
                    success: true,
                    data: " Description of Provider successfully updated"
                }
                res.status(httpStatusCodes.OK || 200).json(result)
                console.log(updated_description.rows, ' -----> updated_description.rows in updateEquipmentProvider function at provider_controller.js', result)
            } else {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', 'updated description'))
                console.log(result, ' ----> err from updateDescription function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '-----> err in updateDescription function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async deleteDescription(req, res) {
        try {
            console.log('Test')
            const provider_id = req.params.providerId
            const deleted_description = await descriptionmodel.deleteAll(provider_id)
            if (deleted_description.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Description of Provider successfully deleted"
                }
                console.log(deleted_description.rows, result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else if (deleted_description.rows.length == 0) {
                const result = new Api404Error('provider_id', i18n.__('validation.isExist', 'description'))
                console.log(result, ' ----> err in deleteDescription function with provider_id = ${provider_id} not exists at provider_controller.js;')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '----> err in deleteDescription function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveSingleDescription(req, res) {
        try {
            console.log('Test')
            const description_id = req.params.descriptionId
            // const provider_id = req.params.providerId
            console.log(req.params)

            const one_description = await descriptionmodel.FindOne(description_id)
            if (one_description.rows.length !== 0) {
                const result = {
                    "success": true,
                    "data": one_description.rows
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api404Error('equipmentId', i18n.__('validation.isExist', `description_id = ${description_id}`))
                console.log(result, ` -----> err in retrieveSingleDescription function  with description_id = ${description_id} not exists at provider_controller.js;`)
                res.status(result.statusCode || 400).json(result)   //  в отвере не надо отправлять "data"  на get запрос, если, сущность не найдена
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveSingleDescription function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    async retrieveMultipleDescriptions(req, res) {
        try {
            const s = req.params.providerId
            const { sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_description = await descriptionmodel.findAll({ sortBy, limit, offset, s })
            console.log(all_description)

            if (all_description[0].rows.length !== 0) {
                console.log(all_description[0].rows, all_description[1].rows)
                const pagination = getPagingData(all_description, page, limit);
                // console.log(pagination)

                const result = {
                    "success": true,
                    "data": all_description[0].rows,
                    "pagination": pagination
                }
                console.log(result)
                res.status(httpStatusCodes.OK || 500).json(result)
            } else {
                const result = new Api404Error('retrive all descriptions of provider', i18n.__('validation.isExist', `providerId =${provider_id}`))
                console.log(result, ` -----> err in retrieveMultipleDescriptions function  at provider_controller.js;`)
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleDescriptions function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Yдобства у Провайдера ###  

    serviceproviderValidationSchema = {

        providerId: {
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from serviceproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in serviceproviderValidationSchema at provider_conrtoller.js")
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
            custom: {
                options: (services, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const services = req.body.services
                        const unique_array = new Set(services)
                        if (services.length == unique_array.size) {
                            return true
                        } else {
                            return Promise.reject(i18n.__('validation.isDuplicate', `services = ${services}`));
                        };

                        // Это второй вариант, первый ниже 
                        // Eсли выбрать второй, то первый надо поднять выше для проверки IsInt в массиве services). 
                        // Плюсы - проверяем одним запросом методом  isExistList. 
                        // Минусы - цикл в модели и цикл для проверки пезультатов в контроллере

                        // return servicemodel.isExistList(services).then(result_list => {
                        //     console.log(result_list[0].rows, '-------> result_list[0].rows services from serviceproviderValidationSchema')
                        //     for (let i = 0; i < result_list.length; i += 1) {
                        //         if (result_list[i].rows[0].exists === false) {
                        //             console.log(`Services = ${services[i]} is not in DB (from provider_conrtoller.js)`)
                        //             return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `services = ${services[i]}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                        //         }
                        //     }
                        // }).catch(err => {
                        //     if (err.error) {
                        //         const server_error = {
                        //             "success": false,
                        //             "error": {
                        //                 "code": err.statusCode,
                        //                 "message": err.error.message,
                        //             },
                        //             "data": err.data,
                        //         }
                        //         console.log(server_error, " ------------------> Server Error in serviceproviderValidationSchema at provider_conrtoller.js")
                        //         return Promise.reject(server_error)
                        //     } else {
                        //         const msg = err
                        //         return Promise.reject(msg)
                        //     };
                        // })
                    }
                },
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
            custom: {
                options: (service_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return servicemodel.isExist(service_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows services from serviceproviderValidationSchema')
                            if (is_exist.rows[0].exists == false) {
                                console.log(`Services = ${service_id} is not in DB (from provider_conrtoller.js)`)
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `services = ${service_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in serviceproviderValidationSchema at provider_conrtoller.js")
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
                options: [['id', 'service_id']],
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
    }

    async addServicesToProvider(req, res) {
        try {
            const { services } = req.body
            const provider_id = req.params.providerId
            await serviceprovidermodel.deleteAll(provider_id)
            const updated_service = await serviceprovidermodel.addAllServices(provider_id, services)

            if (updated_service.rows.length != 0) {
                const result = {
                    success: true,
                    data: " Services successfully added to Provider"
                }
                console.log(updated_service.rows, ' -----> updated_service[0].rows in addServicesToProvider function at provider_controller.js', { result })
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('add service to provider', 'Unhandled Error')
                console.log(result, ' ----> err from addServicesToProvider function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in addServicesToProvider function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  addServicesToProvider function at provider_controller.js ')
                res.status(500).json({ 'Code Error': err.message })
            }
        }
    }

    async retrieveMultipleServicesOfProvider(req, res) {
        try {
            const s = req.params.providerId
            const { state, sortBy, size, page } = req.query
            const { limit, offset } = getPagination(page, size);
            console.log(state, sortBy, limit, offset, s, ' -------->>>>>> req.query')
            const all_services = await serviceprovidermodel.findAll({ state, sortBy, limit, offset, s })
            console.log(all_services)

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
                const result = new Api404Error('retrieve services of rovider', i18n.__('validation.isExist', `${s}`))
                console.log(result, ` -----> err in retrieveMultipleServicesOfProvider function  with  ${s} not exists at activity_controller.js;`)
                res.status(result.statusCode || 500).json(result)
            }



            // const provider_id = req.params.providerId
            // console.log(provider_id)
            // const all_services = await serviceprovidermodel.getAll(provider_id)
            // if (all_services.rows.length !== 0) {
            //     const result = {
            //         "success": true,
            //         "data": all_services.rows
            //     }
            //     console.log(result)
            //     res.status(httpStatusCodes.OK || 200).json(result)
            // } else {
            //     const result = new Api404Error('provider_id', i18n.__('validation.isExist', 'services'))
            //     console.log(result, ` -----> err in retrieveMultipleServicesOfProvider function  at provider_controller.js;`)
            //     res.status(result.statusCode || 400).json(result)
            // }
        } catch (err) {
            console.error({ err }, '---->err in retrieveMultipleServicesOfProvider function at provider_controller.js ')
            res.status(err.statusCode || 500).json(err)
        }
    }

    //  ### Преимущуства провайдера ###

    advantageproviderValidationSchema = {

        providerId: {
            in: ['params'],
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'provider_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'providerId') },
                bail: true,
            },
            custom: {
                options: (providerId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = providerId
                        return providermodel.isExist(provider_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows provider from advantageproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Provider with provider_id = ${provider_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `providerId = ${provider_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
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
                                console.log(server_error, " ------------------> Server Error in advantageproviderValidationSchema at provider_conrtoller.js")
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

        advantageId: { // для удаления
            in: ['params'],
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: advantageId => {
                    return advantageId !== undefined;
                },
                errorMessage: () => { return i18n.__('validation.isInt', 'advantageId') },
                bail: true,
            },
            custom: {
                options: (advantageId, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        const provider_id = req.params.providerId
                        const advantage_id = advantageId

                        return advantagemodel.isUniqueCombination(provider_id, advantage_id).then(is_unique => {
                            console.log(is_unique.rows, '-------> is_unique.rows in Advantage from advantageproviderValidationSchema')
                            if (is_unique.rows[0].exists == true) {
                                return true
                            } else {
                                return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & advantage_id = ${advantage_id}`));
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
                                        "advantage_id": err.data,
                                    }
                                }
                                console.log(server_error, " ------------------> Server Error in advantageproviderValidationSchema at provider_conrtoller.js")
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

        advantage_id: { // для создания
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: () => { return i18n.__('validation.isEmpty', 'advantage_id') },
                bail: true,
            },
            isInt: {  // набо будет заменить на isString когда введет UUID вместо id
                if: advantage_id => {
                    return advantage_id !== undefined;
                },
                options: { min: 0 },
                errorMessage: () => { return i18n.__('validation.isInt', 'advantage_id') },
                bail: true,
            },
            custom: {
                options: (advantage_id, { req, location, path }) => {
                    if (req.method === 'GET') {
                        return true
                    } else {
                        return advantagemodel.isExist(advantage_id).then(is_exist => {
                            console.log(is_exist.rows, '-------> is_exist.rows Advantage from advantageproviderValidationSchema')

                            if (is_exist.rows[0].exists !== true) {
                                console.log('Advantage with advantage_id = ${advantage_id} is not in DB (from provider_conrtoller.js)')
                                return Promise.reject('404 Error:   ' + i18n.__('validation.isExist', `advantage_id = ${advantage_id}`));  // злесь 404 как флаг, который мы проверяем в checkResult()
                            } else {
                                const provider_id = req.params.providerId
                                return advantagemodel.isUniqueCombination(provider_id, advantage_id).then(is_unique => {
                                    console.log(is_unique.rows, '-------> is_unique.rows in Advantage from advantageproviderValidationSchema')
                                    if (is_unique.rows[0].exists == true) {
                                        return Promise.reject(i18n.__('validation.isUniqueCombination', `provider_id = ${provider_id} & advantage_id = ${advantage_id}`));
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
                                                "advantage_id": err.data,
                                            }
                                        }
                                        console.log(server_error, " ------------------> Server Error in advantageproviderValidationSchema at provider_conrtoller.js")
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
                                console.log(server_error, " ------------------> Server Error in advantageproviderValidationSchema at provider_conrtoller.js")
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
    }



    async addAdvantageToProvider(req, res) {
        try {
            console.log('Test', req.params, req.body)
            const { advantage_id } = req.body
            const provider_id = req.params.providerId
            const added_advantage = await advantagemodel.addOneAdvantage(provider_id, advantage_id)
            if (added_advantage.rows[0]) {
                const result = {
                    success: true,
                    data: " Advantage successfully added to Provider"
                }
                console.log(added_advantage.rows, ' -----> added_advantage[0].rows in addAdvantageToProvider function at provider_controller.js', { result })
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('add advantage to provider', 'Unhandled Error')
                console.log(result, ' ----> err from addAdvantageToProvider function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in addAdvantageToProvider function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  addAdvantageToProvider function at provider_controller.js ')
                res.status(500).json({ 'Code Error': err.message })
            }
        }
    }

    async deleteAdvantageFromProvider(req, res) {
        try {
            console.log('Test')
            const advantage_id = req.params.advantageId
            const provider_id = req.params.providerId
            const deleted_advantage = await advantagemodel.deleteOneAdvantage(provider_id, advantage_id)
            if (deleted_advantage.rows.length !== 0) {
                const result = {
                    success: true,
                    data: " Advantage successfully deleted"
                }
                console.log(deleted_advantage.rows, ' -----> deleted_advantage.rows in deleteAdvantageFromProvider function at provider_controller.js', { result })
                res.status(httpStatusCodes.OK || 200).json(result)
            } else {
                const result = new Api400Error('delete advantage', 'Unhandled Error')
                console.log(result, ' ----> err from deleteAdvantageFromProvider function at provider_controller.js')
                res.status(result.statusCode || 400).json(result)
            }
        } catch (err) {
            if (err.error) {
                console.error({ err }, '-----> err in deleteAdvantageFromProvider function at provider_controller.js ')
                res.status(err.statusCode || 500).json(err)
            } else {
                console.error({ err }, '-----> code_error in the  deleteAdvantageFromProvider function at provider_controller.js ')
                res.status(500).json({ 'Code Error': err.message })
            }
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
                    console.log(not_found_error, ` ----> not_found_error from the ProviderController.checkResult`)
                    res.status(not_found_error.statusCode || 500).json(not_found_error)
                } else {
                    const param = validation_result.errors[0].param
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ----> bad_request_error from the ProviderController.checkResult`)
                    res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            } else {
                const server_error = data
                console.log(server_error, ` ----> server_error from the ProviderController.checkResult`)
                res.status(server_error.statusCode || 500).json(server_error)
            }
        } else {
            return next()
        }
    }

}

const provider_controller = new ProviderController();
export { provider_controller }


