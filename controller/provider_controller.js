import { pool } from '../db.js';
import { advantagemodel } from '../models/advantage_model.js';
import { providermodel } from  '../models/provider_model.js';
import { timetablemodel } from '../models/timetable_model.js'; 
import { serviceprovidermodel } from '../models/serviceprovider_model.js';
import { descriptionmodel } from '../models/description_model.js';
import { equipmentprovidermodel } from '../models/equipmentprovider_model.js'; 
import { extratimetablemodel } from '../models/extratimetable_model.js';
import { faremodel } from '../models/fare_model.js';
import { promotionmodel } from '../models/promotion_model.js';


const db = pool


class ProviderController {

    //  Этот код пригодиться для валидации. 

    // const {object, owner, location_descript } = description
    //     // console.log( object, owner, location_descript )
    //     const languages_provider = Array.from(languages[0].split(','), Number)
    //     languages_provider.forEach(languages_provider_id => {
    //         languages_enums.forEach(language => {
    //             console.log(language.id, "language id from language_enums")
    //             if (language.id == languages_provider_id) {
    //                 const locale = language.locale
    //                 const new_description = descriptionmodel.createNewDescription(provider_id, locale, object, owner, location_descript)
    //                 createNewDescription (provider_id, locale, descriptiontype, content) 
    //                 console.log(new_description, 'Tect descriprion')
    //             }
    //         })
    //     });

    //     ### Provider ###

    async createProvider(req, res) {
        // console.log(req.body)
        // console.log(req.body.equipments[0].fares)
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
            languages,
            description
            } = req.body

        console.log(provider_name,
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
            languages,
            description)

        //  Создание графика работы 
        const {start_time, end_time} = timetable[0]
        const new_timetable = await timetablemodel.createNewTimetable(start_time, end_time)
        const timetable_id = new_timetable.rows[0].id;
        // console.log(new_timetable, "new_timetable")

        //  Создание провайдера оказания услуг         
        const new_provider = await providermodel.createNewProvider(provider_name, user_id, timetable_id, providertype_id,
            location, address, post_index, geolocation)
        const provider_id = new_provider.rows[0].id

        //  Добавление  удобств сщзданному провайдеру
        const services_id = Array.from(services[0].split(','), Number)
        services_id.forEach( service_id => {
            // console.log(service_id, "service_id from createNewProvider Model")
            const service_provider = serviceprovidermodel.addOneServiceToProvider(provider_id, service_id)
        // Редактирование удобств перестало работать, так как addOneServiceToProvider был перенесен 
        //  из servicemodel в  providermodel  то есть в this
        // Проблема решится при переносе кода сщздания провайдера из модели в конероллер 
            console.log(service_provider, "Tect servicesproviders")
        });  

        //  Описание провайдера (descriptions) 
        description.forEach(function create(descript) {
            const {locale, descriptiontype, content } = descript
            console.log(typeof(provider_id))
            const new_description = descriptionmodel.createNewDescription(provider_id, locale, descriptiontype, content)        
        })

        //   Инвентарь от объект отдыха  (equipmentprovider) 
        //   И тарификация (fares) 
    equipments.forEach(equipment => {
        const {equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable, fares} = equipment
        const equipmentprovider = equipmentprovidermodel.createNewEquipmentProvider(provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)
        console.log("Test of equipmentprovider", equipmentprovider) 
        equipmentprovider.then(function(result){
            const equipmentprovider_id =  result.rows[0].id

            console.log(equipmentprovider_id)            
            fares.forEach(fare_item => {
                const {duration, time_unit, fare} = fare_item
                const added_fare = faremodel.createNewFare(equipmentprovider_id, duration, time_unit, fare)
            })
        })
    })

        if (new_provider.rows[0].id) {
            //  AND .... Другие условия
            const result = { success: "Provider successfully created" }
            res.json(result)
            console.log(new_provider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
         //  Надо добавитьт  recreationfacilitytype_id  в таблицу recreationfacilitytype
    }


    async activateProvider(req, res) {
        const {active} = req.body
        const provider_id = req.params.id        
        console.log(provider_id)
        const activated_provider = await providermodel.activateOneProvider(provider_id, active)
        if (activated_provider.rows[0].active == true) {
            const result = { success: "Provider successfully activated" }
            res.json(result)
            console.log(activated_provider.rows[0], result)
        } else if (activated_provider.rows[0].active == false) {
            const result = { success: "Provider successfully deactivated" }
            res.json(result)
            console.log(activated_provider.rows[0], result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    } 


    async updateProvider(req, res) {
        const {                    
            provider_name,
            providertype_id,  
            recreationfacilitytype_id,
            user_id,
            location,
            address,
            post_index
            } = req.body
        const provider_id = req.params.id

        //  Надо добавитьт  recreationfacilitytype_id  в таблицу recreationfacilitytype?
        
        console.log(post_index)
        const apdated_provider = await providermodel.updateOneProvider(provider_name, providertype_id, user_id, location, address, post_index, provider_id)
        if (apdated_provider.rows[0].id) {
            //  AND .... Другие условия
            const result = { success: true }
            res.json(result)
            console.log(apdated_provider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }
    

    async deleteProvider(req, res) {
        const provider_id = req.params.id        
        console.log(provider_id)
        const deleted_provider = await providermodel.deleteOneProvider(provider_id)
        if (deleted_provider.rows[0].id) {
            //  AND .... Другие условия
            const result = { success: true }
            res.json(result)
            console.log(deleted_provider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    
    async getProvider(req, res) {        
        const provider_id = req.params.id        
        console.log(provider_id)
        const provider = await providermodel.getOneProvider(provider_id)
        if (provider.rows[0]) {
            const result =  provider.rows[0]
            res.json(result)
            console.log(result)
        } else {
            const result = "Error"
            res.json(result)
        }
    }
    

    async getProviders(req, res) {
        const {                    
            provider_name,
            location,
            address,
            post_index
            } = req.body
        const providertype_id = +req.body.providertype_id
        const recreationfacilitytype_id = +req.body.recreationfacilitytype_id
        const user_id = +req.body.user_id
        const rating = +req.body.rating
        const distance_from_center = +req.body.distance_from_center
        console.log(provider_name, location, address, typeof(providertype_id))
        const provider = await providermodel.getListProviders(
            provider_name,
            providertype_id,
            user_id,
            location,
            address,
            post_index,
            rating,
            distance_from_center)

        if (provider.rows[0]) {
            const result =  provider.rows
            res.json(result)
            console.log(result)
        } else {
            const result = "Error"
            res.json(result)
        }
    }

    async getBestProviders(req, res) {
        const best_providers = await providermodel.getBest(req, res)
        res.json((best_providers).rows)
    }

     //     ### Timetable ###

     async createTimetable (req, res) {
        const {start_time, end_time} = req.body
        const new_timetable = await timetablemodel.createNewTimetable(start_time, end_time)               
        if (new_timetable.rows[0].id ) {
            const result = { success: "Timetable successfully created" }
            res.json(result)
            console.log(new_timetable.rows[0], result)
            // res.json( new_timetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }


    async updateTimetable (req, res) {
        const {start_time, end_time} = req.body
        const timetable_id = req.params.timetableId
        const updatted_timetable = await timetablemodel.updateOneTimetable(timetable_id, start_time, end_time)               
        if (updatted_timetable.rows[0]) {
            const result = { success: true }
            res.json(result)
            console.log(updatted_timetable.rows[0], result)
            // res.json(updatted_timetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteTimetable (req, res) {
        const timetable_id = req.params.timetableId
        const deleted_timetable = await timetablemodel.deleteOneTimetable(timetable_id)               
        if (deleted_timetable.rows[0] !== undefined) {
            const result = { success: true }
            res.json(result)
            console.log(deleted_timetable.rows[0], result)
            // res.json(deleted_timetable.rows[0].id)
        } else {
            //  не работает для уже удаленной записию См коммент выше
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async getTimetable (req, res) {
        const timetable_id = req.params.timetableId
        const one_timetable = await timetablemodel.getOneTimetable(timetable_id)               
        if (one_timetable.rows[0] !== undefined) {
            const result = one_timetable.rows[0]
            res.json(result)
            console.log(deleted_timetable.rows[0], result)
            // res.json(deleted_timetable.rows[0].id)
        } else {
            //  не работает для уже удаленной записию См коммент выше
            const result = { Error: "Error" }
            res.json(result)
        }
    }




    //     ### Extratimetable ###

    async createExtratimetable (req, res) {
        console.log('Test')
        const {provider_id, date, start_time, end_time} = req.body
        const new_extratimetable = await extratimetablemodel.createNewExtratimetable(provider_id, date, start_time, end_time)               
        if (new_extratimetable.rows[0].id ) {
            const result = { success: "Extratimetable successfully created" }
            res.json(result)
            console.log(new_extratimetable.rows[0], result)
            // res.json( new_extratimetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateExtratimetable (req, res) {
        console.log('Test')
        const {provider_id, date, start_time, end_time} = req.body
        const extratimetable_id = req.params.extradateId
        const updatad_extratimetable = await extratimetablemodel.updateNewExtratimetable(extratimetable_id, provider_id, date, start_time, end_time)               
        if (updatad_extratimetable.rows[0] !== undefined ) {
            const result = { success: true }
            res.json(result)
            console.log(updatad_extratimetable.rows[0], result)
            // res.json( updatad_extratimetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteExtratimetable (req, res) {
        console.log('Test')
        const extratimetable_id = req.params.extradateId
        const deleted_extratimetable = await extratimetablemodel.deleteOneExtratimetable(extratimetable_id)               
        if (deleted_extratimetable.rows[0] !== undefined ) {
            const result = { success: true }
            res.json(result)
            console.log(deleted_extratimetable.rows[0], result)
            // res.json( deleted_extratimetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async getOneExtratimetable (req, res) {
        console.log('Test')
        const extratimetable_id = req.params.extradateId
        
        const one_extratimetable = await extratimetablemodel.getOneExtratimetableOfProvider(extratimetable_id)               
        if (one_extratimetable.rows[0] !== undefined ) {
            const result = one_extratimetable.rows[0]
            res.json(result)
            console.log(one_extratimetable.rows[0], result)
            // res.json( one_extratimetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }
   


    async getAllExtratimetable (req, res) {
        console.log('Test')
        const  {provider_id} = req.body
        const all_extratimetable = await extratimetablemodel.getAllExtratimetableOfProvider(provider_id)               
        if (all_extratimetable.rows[0] !== undefined ) {
            const result = all_extratimetable.rows
            res.json(result)
            console.log(all_extratimetable.rows, result)
            // res.json(all_extratimetable.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    // ####  Инвентарь от объект отдыха  (equipmentprovider) ###

    async createEquipmentProvider (req, res) {
        console.log('Test')
        const {
            equipment_id,
            quantity, 
            availabilitydate, 
            cancellationdate, 
            discountnonrefundable
        } = req.body
        const provider_id = req.params.providerId
        const new_equipments = await equipmentprovidermodel.createNewEquipmentProvider(provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)               
        if (new_equipments.rows[0].id ) {
            const result = { success: "Equipments of Provider successfully created" }
            res.json(result)
            console.log(new_equipments.rows[0], result)
            // res.json( new_person.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateEquipmentProvider (req, res) {
        console.log('Test')
        const {
            equipment_id,
            quantity, 
            availabilitydate, 
            cancellationdate, 
            discountnonrefundable
        } = req.body
        const provider_id = req.params.id
        const new_equipments = await equipmentprovidermodel.updateOneEquipmentProvider(provider_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)                              
        // console.log(new_equipments)
        if (new_equipments.rows) {
            const result = { success: "Equipments of Provider successfully updated" }
            res.json(result)
            console.log(result)
            // res.json( new_person.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async activateEquipmentProvider (req, res) {
        // console.log(req.params.id)
        const {active} = req.body
        const equipmentprovider_id = req.params.id
        const activated_equipmentprovider = await equipmentprovidermodel.activateOneEquipmentProvider(equipmentprovider_id, active)
        // console.log(activated_serviceprovider)
        if (activated_equipmentprovider.rows &&  active == "true") {
            const result = { success: "Equipment of provider successfully activated" }
            res.json(result)
            // console.log(activated_equipmentprovider.rows[0], result)
        } else if (activated_equipmentprovider.rows && active == "false") {
            const result = { success: "Equipment of provider successfully deactivated" }
            res.json(result)
            console.log(activated_equipmentprovider.rows, result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }

    async deleteEquipmentProvider(req, res) { 
        console.log(req.params.id)
        const equipmentprovider_id = req.params.id
        console.log(equipmentprovider_id, "Test delete equipmentprovider")
        const deleted_equipmentprovider = await equipmentprovidermodel.deleteOneEquipmentProvider(equipmentprovider_id)
        if (deleted_equipmentprovider.rows) {
            const result = { success: "true" }
            res.json(result)
            console.log(deleted_equipmentprovider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }   
     
    async getOneEquipmentProvider(req, res) { 
        console.log(req.params.id)
        const equipmentprovider_id = req.params.equipmentId
        console.log(equipmentprovider_id, "Test equipmentprovider")
        const one_equipmentprovider = await equipmentprovidermodel.getOneEquipmentOfProvider(equipmentprovider_id)
        if (one_equipmentprovider.rows.length !== 0) {
            const result = one_equipmentprovider.rows[0]
            res.json(result)
            console.log(one_equipmentprovider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }  

     async getAllEquipmentProvider(req, res) { 
        console.log(req.params.id)
        const {provider_id} = req.body
        console.log(provider_id, "Test get_all_equipmentprovider")
        const all_equipmentprovider = await equipmentprovidermodel.getAllEquipmentOfProvider(provider_id)
        if (all_equipmentprovider.rows.lenth !== 0) {
            const result = all_equipmentprovider.rows
            res.json(result)
            console.log(all_equipmentprovider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }  

    //  ###  Тарификация (fares)  ###

    async createFare (req, res) {
        const {equipmentprovider_id, duration, time_unit, fare} = req.body
        console.log(equipmentprovider_id)

        const new_fare = await faremodel.createNewFare (equipmentprovider_id, duration, time_unit, fare)              
        if (new_fare.rows[0].id ) {
            const result = { success: "Fare  successfully created" }
            res.json(result)
            console.log(new_fare.rows[0], result)
            // res.json( new_person.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async updateFare (req, res) {
        const {equipmentprovider_id, duration, time_unit, fare} = req.body
        const fare_id = req.params.fareId
        console.log(equipmentprovider_id)

        const new_fare = await faremodel.updateNewFare (fare_id, equipmentprovider_id, duration, time_unit, fare)              
        if (new_fare.rows[0].id ) {
            const result = { success: "Fare  successfully updated" }
            res.json(result)
            console.log(new_fare.rows[0], result)
            // res.json( new_person.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteFare (req, res) {
        const fare_id = req.params.fareId
        console.log(fare_id)
        const deleted_fare = await faremodel.deleteOneFare(fare_id)              
        if (deleted_fare.rows[0] !== undefined ) {
            const result = { success: true }
            res.json(result)
            console.log(deleted_fare.rows[0], result)
            // res.json( deleted_fare.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    
    async getFare (req, res) {
        const fare_id = req.params.fareId
        console.log(fare_id)
        const one_fare = await faremodel.getOneFare(fare_id)              
        if (one_fare.rows.length !== 0 ) {
            const result = one_fare.rows[0]
            res.json(result)
            console.log(result)
            // res.json( one_fare.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async getFares (req, res) {
        const equipmentprovider_id = req.params.equipmentId
        console.log(equipmentprovider_id)
        const all_fare = await faremodel.getAllFares(equipmentprovider_id)              
        if (all_fare.rows.length !== 0 ) {
            const result = all_fare.rows
            res.json(result)
            console.log(result)
            // res.json( one_fare.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

//     ### Promotions ###

async createPromotion (req, res) {
    console.log('Test')
    const {equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end } = req.body
    const new_promotion = await promotionmodel.createNewPromotion(equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end )               
    if (new_promotion.rows[0] !== undefined ) {
        const result = { success: "Promotion successfully created" }
        res.json(result)
        console.log(new_promotion.rows[0], result)
        // res.json( new_promotion.rows[0].id)
    } else {
        const result = { success: "Error" }
        res.json(result)
    }
}

async updatePromotion (req, res) {
    console.log('Test')
    const {equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end } = req.body
    const promotion_id = req.params.promotionId
    const updatad_promotion = await promotionmodel.updateNewPromotion(promotion_id, equipmentprovider_id, title, discount, booking_start, booking_end, activity_start, activity_end )               
    if (updatad_promotion.rows[0] !== undefined) {
        const result = { success: true }
        res.json(result)
        console.log(updatad_promotion.rows[0], result)
        // res.json( updatad_promotion.rows[0].id)
    } else {
        const result = { success: "Error" }
        res.json(result)
    }
}

async activatePromotion (req, res) {
    const promotion_id = req.params.promotionId
    const {active} = req.body
    console.log('Test', active)
    const activated_promotion = await promotionmodel.deleteOnePromotion(promotion_id, active)               
    if (activated_promotion.rows &&  active == "true") {
        const result = { success: "Promotion successfully activated" }
        res.json(result)
        // console.log(activated_equipmentprovider.rows[0], result)
    } else if (activated_promotion.rows && active == "false") {
        const result = { success: "Promotion successfully deactivated" }
        res.json(result)
        console.log(activated_promotion.rows, result)
    } else {
        const result = { Error: "Error" }
        res.json(result)
    }  
}

async deletePromotion (req, res) {
    console.log('Test')
    const promotion_id = req.params.promotionId
    const deleted_promotion = await promotionmodel.deleteOnePromotion(promotion_id)               
    if (deleted_promotion.rows[0] !== undefined ) {
        const result = { success: true }
        res.json(result)
        console.log(deleted_promotion.rows[0], result)
        // res.json( deleted_promotion.rows[0].id)
    } else {
        const result = { success: "Error" }
        console.log(deleted_promotion.rows[0], result)
        res.json(result)
    }
}

async getOnePromotion (req, res) {
    const promotion_id = req.params.promotionId
    console.log('Test', promotion_id)    
    const one_promotion = await promotionmodel.getOnePromotionOfProvider(promotion_id)               
    if (one_promotion.rows[0] !== undefined ) {
        const result = one_promotion.rows[0]
        res.json(result)
        console.log(one_promotion.rows[0], result)
        // res.json( one_promotion.rows[0].id)
    } else {
        const result = { success: "Error" }
        res.json(result)
    }
}

async getAllPromotions (req, res) {
    const equipmentprovider_id = req.params.equipmentId
    console.log('Test', equipmentprovider_id)
    const all_promotion = await promotionmodel.getAllPromotionsOfProvider(equipmentprovider_id)               
    if (all_promotion.rows[0] !== undefined ) {
        const result = all_promotion.rows
        res.json(result)
        console.log(all_promotion.rows, result)
        // res.json(all_promotion.rows[0].id)
    } else {
        const result = { success: "Error" }
        res.json(result)
    }
}

    //  ### Описание объекта (descriptions) ###

    async createDescription (req, res) {
        console.log('Test')
        const descriptions = req.body
        console.log(descriptions)
        const provider_id = req.params.id
        let new_descriptions =[]

        descriptions.description.forEach(function create(descript) {
            const {locale, descriptiontype, content } = descript
            console.log(typeof(provider_id))
            const new_description = descriptionmodel.createNewDescription(provider_id, locale, descriptiontype, content)      
            console.log(new_description.rows, 1111111111111)
                new_description.then(
                    new_descriptions.push(new_description.rows)
             )            
            console.log(new_descriptions, '2222222222222')            
        })
        console.log(new_descriptions)

            if (new_descriptions.length != 0 ) {
                const result = { success: "Description  successfully created" }
                res.json(result)
                console.log(result)
                // res.json( new_description.rows[0].id)
            } else {
                const result = { success: "Error" }
                res.json(result)
            }        
    }


    async updateDescription (req, res) {
        const descriptions = req.body
        const provider_id = req.params.id
        descriptionmodel.deleteAllDescriptionsOfProvider(provider_id)  
        let new_descriptions =[]

        descriptions.description.forEach(function create(descript) {
            const {locale, descriptiontype, content } = descript
            console.log(typeof(provider_id))
            const new_description = descriptionmodel.createNewDescription(provider_id, locale, descriptiontype, content)      
            console.log(new_description.rows, '1111111111111')
                new_description.then(
                    new_descriptions.push(new_description.rows)
             )            
            console.log(new_descriptions, '2222222222222')            
        })
        console.log(new_descriptions)

            if (new_descriptions.length != 0 ) {
                const result = { success: "Description  successfully updated" }
                res.json(result)
                console.log(result)
                // res.json( new_description.rows[0].id)
            } else {
                const result = { success: "Error" }
                res.json(result)
            }        
    }

    async deleteDescription (req, res) {
        console.log('Test')
        const provider_id = req.params.id
        const deleted_description = await descriptionmodel.deleteAllDescriptionsOfProvider(provider_id)               
        if (deleted_description.rows[0].id ) {
            const result = { success: "Description  successfully deleted" }
            res.json(result)
            console.log(deleted_description.rows[0], result)
            // res.json( deleted_description.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    
    
    async getDescription (req, res) {
        console.log('Test')
        const description_id = req.params.descriptionId
        // const provider_id = req.params.providerId
        console.log(req.params)

        const one_description = await descriptionmodel.getOneDescription(description_id)               
        if (one_description.rows[0] !== undefined ) {
            const result = one_description.rows[0]
            res.json(result)
            console.log(one_description.rows[0], result)
            // res.json( one_description.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async getAllDescriptions (req, res) {
        console.log('Test')
        const provider_id = req.params.providerId
        console.log(req.params)

        const all_descriptions = await descriptionmodel.getAllDescriptionsOfProvider(provider_id)               
        if (all_descriptions.rows[0] !== undefined ) {
            const result = all_descriptions.rows
            res.json(result)
            console.log(result)
            // res.json( all_descriptions.rows)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }
    
//  ### Yдобства у Провайдера ###    

    async addServicesToProvider (req, res) {
        const {services} = req.body
        const services_id = Array.from(services[0].split(','), Number)
        const provider_id = req.params.id
        serviceprovidermodel.deleteAllServicesOfProvider(provider_id)
        let services_list =[]
        services_id.forEach(service_id => {
            console.log(service_id, "service_id from addServicesToProvider of providercontroller")
            const updated_service = serviceprovidermodel.addOneServiceToProvider(provider_id, service_id)  
            const serv = updated_service.then(function(service) {    
                console.log(service.rows, "Tect of adding services to provideres")                 
                // return  updated_service
                })           
            services_list.push(serv)
            }); 
        if (services_list.length == services_id.length) {
            const result = { success: "Services updated successfully" }
            res.json(result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }  

    async getServicesOfProvider (req, res) {
        const provider_id = req.params.providerId
        console.log(provider_id)
        const all_services = await serviceprovidermodel.getAllServicesOfProvider(provider_id)  
        console.log(all_services)            
        if (all_services.rows) {
            const result = all_services.rows
            res.json(result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }
//  ### Преимущуства провайдера ###

    
    async addAdvantageToProvider (req, res) {
        console.log('Test', req.params, req.body)
        const {advantage_id} = req.body
        const provider_id = req.params.providerId 
        const added_advantage = await advantagemodel.addNewAdvantageToProvider(provider_id, advantage_id)             
        if (added_advantage.rows[0] ) {
            const result = { success: true }
            res.json(result)
            console.log(added_advantage.rows[0])
            // res.json( added_advantage.rows[0])
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async deleteAdvantageFromProvider (req, res) {
        console.log('Test')
        const advantage_id = req.params.advantageId
        const {provider_id} = req.body
        const deleted_advantage = await advantagemodel.deleteOneAdvantageFromProvider(provider_id, advantage_id)               
        if (deleted_advantage.rows[0] !== undefined ) {
            const result = { success: true }
            res.json(result)
            console.log(deleted_advantage.rows[0], result)
            // res.json( deleted_advantage.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }



}

const provider_controller = new ProviderController();
export { provider_controller }


