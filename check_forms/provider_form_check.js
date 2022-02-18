import i18n from 'i18n';
import Api400Error from '../errors/api400_error.js';
import { countProperties, checkQueryProperties } from './_form_check_methods.js';


class ProviderFormCheck {

    forCreate(req, res, next) {

        // проверка на количество параметров
        const count_require = 11
        const count_total = 13
        const count_properties = countProperties(req.body)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {

            const param = 'in create form of provider '
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)

            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров

        if (req.body.hasOwnProperty('provider_name')) {
            console.log(req.body.provider_name, "provider_name")
        } else {
            const param = 'provider_name'
            const data = i18n.__('validation.isProvided', 'provider_name')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('providertype_id')) {
            console.log(req.body.providertype_id, "providertype_id")
        } else {
            const param = 'providertype_id'
            const data = i18n.__('validation.isProvided', 'providertype_id')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.providertype_id == 1) {
            if (req.body.hasOwnProperty('recreationfacilitytype_id')) {
                console.log(req.body.recreationfacilitytype_id, "recreationfacilitytype_id")
            } else {
                const param = 'recreationfacilitytype_id'
                const data = i18n.__('validation.isProvided', 'recreationfacilitytype_id')
                const bad_request_error = new Api400Error(param, data)
                console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
            }
        }

        if (req.body.hasOwnProperty('user_id')) {
            console.log(req.body.user_id, "user_id")
        } else {
            const param = 'user_id'
            const data = i18n.__('validation.isProvided', 'user_id')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('geolocation')) {
            console.log(req.body.geolocation, "geolocation")
        } else {
            const param = 'geolocation'
            const data = i18n.__('validation.isProvided', 'geolocation')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('location')) {
            console.log(req.body.location, "location")
        } else {
            const param = 'location'
            const data = i18n.__('validation.isProvided', 'location')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('address')) {
            console.log(req.body.address, "address")
        } else {
            const param = 'address'
            const data = i18n.__('validation.isProvided', 'address')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('post_index')) {
            console.log(req.body.post_index, "post_index")
        } else {
            const param = 'post_index'
            const data = i18n.__('validation.isProvided', 'post_index')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('equipments')) {

            const count_require = 5
            const count_total = 5
            const equipments = req.body.equipments;
            console.log(equipments, "equipments")
                  
            for (let i = 0; i < equipments.length; i++) {                
                 // проверка на количество параметров
                const count_properties = countProperties(req.body.equipments[i])
                console.log(count_properties, "count of properties");

                if (count_properties < count_require || count_properties > count_total) {
                    const param = `${equipments[i]} in create form of provider`
                    const data = i18n.__('validation.isMatch', ` ${count_total}`, `${count_properties}`)
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }

                 // проверка на налиние параметров
                const { equipment_id, availabilitydate, cancellationdate, quantity, fares } = equipments[i]

                if (!equipment_id) {
                    const param = 'equipment_id'
                    const data = i18n.__('validation.isProvided', 'equipments/  equipment_id')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!availabilitydate) {
                    const param = 'availabilitydate'
                    const data = i18n.__('validation.isProvided', 'equipments/  availabilitydate')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!cancellationdate) {
                    const param = 'cancellationdate'
                    const data = i18n.__('validation.isProvided', 'equipments/  cancellationdate')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!quantity) {
                    const param = 'quantity'
                    const data = i18n.__('validation.isProvided', 'equipments/  quantity')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!fares) {
                    const param = 'fares'
                    const data = i18n.__('validation.isProvided', 'fares')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (fares) {
                    const count_require = 4
                    const count_total = 4
                    // const fares = req.body.equipments.fares
                    for (let i = 0; i < fares.length; i++) {
                        // проверка на количество параметров
                        const count_properties = countProperties(fares[i])
                        console.log(count_properties, "count of properties");

                        if (count_properties < count_require || count_properties > count_total) {
                            const param = `${fares[i]} in create form of provider`
                            const data = i18n.__('validation.isMatch', `${count_total}`, `${count_properties}`)
                            const bad_request_error = new Api400Error(param, data)
                            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                        }
                        // проверка на налиние параметров 
                        const { duration, time_unit, fare, discountnonrefundable } = fares[i]
                        console.log(fares[i], ' ---> fares[i]')

                        if (!duration) {
                            const param = 'duration'
                            const data = i18n.__('validation.isProvided', 'fares/  duration')
                            const bad_request_error = new Api400Error(param, data)
                            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                        } else if (!time_unit) {
                            const param = 'time_unit'
                            const data = i18n.__('validation.isProvided', 'fares/   time_unit')
                            const bad_request_error = new Api400Error(param, data)
                            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                        } else if (!fare) {
                            const param = 'fare'
                            const data = i18n.__('validation.isProvided', 'fares/  fare')
                            const bad_request_error = new Api400Error(param, data)
                            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                        } else if (!discountnonrefundable) {
                            const param = 'discountnonrefundable'
                            const data = i18n.__('validation.isProvided', 'fares/   discountnonrefundable')
                            const bad_request_error = new Api400Error(param, data)
                            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                        }
                    }
                }
            }

        } else {
            const param = 'equipments'
            const data = i18n.__('validation.isProvided', 'equipments')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('description')) {
            const description = req.body.description
            console.log(description, "description")
            for (let i = 0; i < description.length; i++) {
                console.log(description[i], i, ' ---> description')
                const { locale, descriptiontype, content } = description[i]

                if (!locale) {
                    const param = 'locale'
                    const data = i18n.__('validation.isProvided', 'description/  locale')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!descriptiontype) {
                    const param = 'description'
                    const data = i18n.__('validation.isProvided', 'description/   descriptiontype')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)

                } else if (!content) {
                    const param = 'description'
                    const data = i18n.__('validation.isProvided', 'description/   content')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            }
        } else {
            const param = 'description'
            const data = i18n.__('validation.isProvided', 'description')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('timetable')) {
            const timetable = req.body.timetable
            console.log(timetable, "timetable")
            for (let day = 0; day < timetable.length; day++) {
                console.log(timetable[day].start_time, day, ' ---> day')
                const { start_time, end_time } = timetable[day]
                if (!start_time) {
                    const param = 'start_time'
                    const data = i18n.__('validation.isProvided', 'timetable/  start_time ')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                } else if (!end_time) {
                    const param = 'end_time'
                    const data = i18n.__('validation.isProvided', 'timetable/   end_time')
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            }
        } else {
            const param = ' timetable'
            const data = i18n.__('validation.isProvided', ' timetable')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('services')) {
            console.log(req.body.services, " services")
            return next()
        } else {
            const param = ' services'
            const data = i18n.__('validation.isProvided', ' services')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forCreate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }

    forUpdate(req, res, next) {

        // проверка на количество параметров
        const count_require = 6
        const count_total = 7
        const count_properties = countProperties(req.body)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {
            const param = 'in update form of provider '
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total}  `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров
        if (req.body.hasOwnProperty('provider_name')) {
            console.log(req.body.provider_name, "provider_name")
        } else {
            const param = 'provider_name'
            const data = i18n.__('validation.isProvided', 'provider_name')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('providertype_id')) {
            console.log(req.body.providertype_id, "providertype_id")
        } else {
            const param = 'providertype_id'
            const data = i18n.__('validation.isProvided', 'providertype_id')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.providertype_id == 1) {
            if (req.body.hasOwnProperty('recreationfacilitytype_id')) {
                console.log(req.body.recreationfacilitytype_id, "recreationfacilitytype_id")
            } else {
                const param = 'recreationfacilitytype_id'
                const data = i18n.__('validation.isProvided', 'recreationfacilitytype_id')
                const bad_request_error = new Api400Error(param, data)
                console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
                return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
            }
        }

        if (req.body.hasOwnProperty('user_id')) {
            console.log(req.body.user_id, "user_id")
        } else {
            const param = 'user_id'
            const data = i18n.__('validation.isProvided', 'user_id')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('location')) {
            console.log(req.body.location, "location")
        } else {
            const param = 'location'
            const data = i18n.__('validation.isProvided', 'location')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('address')) {
            console.log(req.body.address, "address")
        } else {
            const param = 'address'
            const data = i18n.__('validation.isProvided', 'address')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.body.hasOwnProperty('post_index')) {
            console.log(req.body.post_index, "post_index")
            return next()
        } else {
            const param = 'post_index'
            const data = i18n.__('validation.isProvided', 'post_index')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }

    forActivate(req, res, next) {

        // проверка на количество параметров
        const count_require = 1
        const count_total = 1
        const count_properties = countProperties(req.body)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {

            const param = 'in activate form of provider '
            const data = i18n.__('validation.isMatch', `${count_total} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forUpdate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров
        if (req.body.hasOwnProperty('active')) {
            console.log(req.body.active, "active")
            return next()
        } else {
            const param = 'active'
            const data = i18n.__('validation.isProvided', 'active')
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forActivate function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
    }

    forRetrieve(req, res, next) {

        // проверка на количество параметров
        const count_require = 0
        const count_total = 5
        const count_properties = countProperties(req.query)
        console.log(count_properties, "count of properties");

        if (count_properties < count_require || count_properties > count_total) {
            const param = 'retrieve providers'
            const data = i18n.__('validation.isMatch', ` ${count_require} - ${count_total} `, `${count_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }
        // проверка на налиние параметров            
        const expected_array = ['state', 'sortBy', 'size', 'page', 's']
        const check_properties = checkQueryProperties(req.query, expected_array)
        // console.log(check_properties)
        if (check_properties !== true) {
            const param = 'retrieve providers'
            const data = i18n.__('validation.isExpected', `${check_properties}`)
            const bad_request_error = new Api400Error(param, data)
            console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the provider_form_check.js`)
            return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
        }

        if (req.query.sortBy) {
            const expected_array_of_sortBy = ['field', 'direction']
            for (let i = 0; i < req.query.sortBy.length; i++) {
                const check_properties_of_sortBy = checkQueryProperties(req.query.sortBy[i], expected_array_of_sortBy)
                if (check_properties_of_sortBy !== true) {
                    const param = 'retrieve providers'
                    const data = i18n.__('validation.isExpected', `${check_properties_of_sortBy}`)
                    const bad_request_error = new Api400Error(param, data)
                    console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the provider_form_check.js`)
                    return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
                }
            }
        }
        
        if (req.query.s) {
            const expected_array_of_s = ['providerName', 'providertypeId', 'userId', 'location', 'address', 'postIndex', 'rating', 'distanceFromCenter' ]
            const check_properties_of_s = checkQueryProperties(req.query.s, expected_array_of_s)
            if (check_properties_of_s !== true) {
                const param = 'retrieve providers'
                const data = i18n.__('validation.isExpected', `${check_properties_of_s}`)
                const bad_request_error = new Api400Error(param, data)
                console.log(bad_request_error, ` ------> bad_request_error in forRetrieve function at the provider_form_check.js`)
                return res.status(bad_request_error.statusCode || 500).json(bad_request_error)
            } else {
                return next()
            }
        }
        return next()
    }
}

const providerFormCheck = new ProviderFormCheck();
export { providerFormCheck }
