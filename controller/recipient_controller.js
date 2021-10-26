import { pool } from '../db.js';
import { activity } from '../models/activity_model.js';
import { recipientmodel } from  '../models/recipient_model.js';
import { timetablemodel } from '../models/timetable_model.js'; 
import { servicemodel } from '../models/service_model.js';
import { deckriptionmodel } from '../models/description_model.js';
import { equipmentrecipientmodel } from '../models/equipmentrecipient_model.js'; 
import { extratimetablemodel } from '../models/extratimetable_model.js';
import { faremodel } from '../models/fare_model.js';


const db = pool


class RecipientController {

    //     ### Recipient ###

    async createRecipient(req, res) {
        
        const new_recipient = await recipientmodel.createNewRecipient(req, res)
        if (new_recipient.rows[0].id) {
            //  AND .... Другие условия
            const result = { success: "Recipient successfully created" }
            res.json(result)
            console.log(new_recipient.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
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
        const timetable_id = req.params.id
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
        const timetable_id = req.params.id
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



    //     ### Extratimetable ###

    async createExtratimetable (req, res) {
        console.log('Test')
        const {recipientofservices_id, date, start_time, end_time} = req.body
        const new_extratimetable = await extratimetablemodel.createNewExtratimetable(recipientofservices_id, date, start_time, end_time)               
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
        const {recipientofservices_id, date, start_time, end_time} = req.body
        const extratimetable_id = req.params.id
        const updatad_extratimetable = await extratimetablemodel.updateNewExtratimetable(extratimetable_id, recipientofservices_id, date, start_time, end_time)               
        if (updatad_extratimetable.rows[0].id ) {
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
        const extratimetable_id = req.params.id
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
    // ####  Инвентарь от объект отдыха  (equipments_recipientofcervices) ###

    async createEquipmentProvider (req, res) {
        console.log('Test')
        const {
            recipientofservices_id,
            equipment_id,
            quantity, 
            availabilitydate, 
            cancellationdate, 
            discountnonrefundable
        } = req.body
        const new_equipments = await equipmentrecipientmodel.createNewEquipmentProvider(recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)               
        if (new_equipments.rows[0].id ) {
            const result = { success: "Equipments of Recipientofcervices successfully created" }
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
        const recipientofservices_id = req.params.id
        const new_equipments = await equipmentrecipientmodel.updateOneEquipmentProvider(recipientofservices_id, equipment_id, quantity, availabilitydate, cancellationdate, discountnonrefundable)                              
        // console.log(new_equipments)
        if (new_equipments.rows) {
            const result = { success: "Equipments of Recipientofcervices successfully updated" }
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
        const {equipment_id, active} = req.body
        const recipientofservices_id = req.params.id
        const activated_equipmentprovider = await equipmentrecipientmodel.activateOneEquipmentProvider(recipientofservices_id, equipment_id, active)
        // console.log(activated_serviceprovider)
        if (activated_equipmentprovider.rows &&  active == "true") {
            const result = { success: "Service of provider successfully activated" }
            res.json(result)
            // console.log(activated_equipmentprovider.rows[0], result)
        } else if (activated_equipmentprovider.rows && active == "false") {
            const result = { success: "Service of provider successfully deactivated" }
            res.json(result)
            console.log(activated_equipmentprovider.rows, result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }

    async deleteEquipmentProvider(req, res) { 
        console.log(req.params.id)
        const{equipment_id} = req.body
        const recipientofservices_id = req.params.id
        console.log(recipientofservices_id, "Test deleteService")
        const deleted_equipmentprovider = await equipmentrecipientmodel.deleteOneEquipmentProvider(recipientofservices_id, equipment_id)
        if (deleted_equipmentprovider.rows) {
            const result = { success: "true" }
            res.json(result)
            console.log(deleted_equipmentprovider.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

    //  ###  Тарификация (fares)  ###

    async createFare (req, res) {
        const {equipment_recipientofservices_id, duration, time_unit, fare} = req.body
        console.log(equipment_recipientofservices_id)

        const new_fare = await faremodel.createNewFare (equipment_recipientofservices_id, duration, time_unit, fare)              
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
        const {equipment_recipientofservices_id, duration, time_unit, fare} = req.body
        const id = req.params.id
        console.log(equipment_recipientofservices_id)

        const new_fare = await faremodel.updateNewFare (id, equipment_recipientofservices_id, duration, time_unit, fare)              
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
        const fare_id = req.params.id
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



    //  ### Описание объекта (descriptions) ###

    async createDescription (req, res) {
        console.log('Test')
        const { recipientofservices_id, locale, object, owner, location } = req.body
        const new_description = await deckriptionmodel.createNewDescription(recipientofservices_id, locale, object, owner, location)               
        if (new_description.rows[0].id ) {
            const result = { success: "Description  successfully created" }
            res.json(result)
            console.log(new_description.rows[0], result)
            // res.json( new_description.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

//  ### Редактирование удобств ###

    async addService (req, res) {
        console.log('Test')
        const {recipientofservices_id, service_id } = req.body
        const added_service = await servicemodel.addOneService(recipientofservices_id, service_id)  
        console.log(added_service.rows[0])             
        if (added_service.rows[0].service_id ) {
            const result = { success: "Service  successfully added" }
            res.json(result)
            
            // res.json( added_service.rows[0].id)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    async getBestRecipients(req, res) {
        const best_Recipients = await recipient.getBest(req, res)
        res.json((best_Recipients).rows)
    }

}

const recipient_controller = new RecipientController();
export { recipient_controller }


