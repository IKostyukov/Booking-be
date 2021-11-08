import { servicemodel } from '../models/service_model.js';


class ServiceControlller{

    //  ### Создать удобство ###
    async createService(req, res) { 
        const {service_name} = req.body
        const new_service = await servicemodel.ceateNewService(service_name)
        if (new_service.rows[0].id) {
            const result = { success: "true" }
            res.json(result)
            console.log(new_service.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

    //  ### Обновить удобство ###
    async updateService(req, res) { 
        // console.log(req.params.id)
        const {service_name} = req.body
        const service_id = req.params.id
        console.log(service_id, service_name, "Test updateService")

        const new_service = await servicemodel.updateOneService(service_id, service_name)
        if (new_service.rows) {
            const result = { success: "true" }
            res.json(result)
            console.log(result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
    }

     //  ### Активировать удобство ###
    async activateService (req, res) {
        // console.log(req.params.id)
        const {active} = req.body
        const service_id = req.params.id
        const activated_service = await servicemodel.activateOneService(service_id, active)
        if (activated_service.rows[0].active == true) {
            const result = { success: "Service successfully activated" }
            res.json(result)
            console.log(activated_service.rows[0], result)
        } else if (activated_service.rows[0].active == false) {
            const result = { success: "Service successfully deactivated" }
            res.json(result)
            console.log(activated_service.rows[0], result)
        } else {
            const result = { Error: "Error" }
            res.json(result)
        }  
    }

     //  ### Удалить удобство ###
     async deleteService(req, res) { 
        console.log(req.params.id)
        const service_id = req.params.id
        console.log(service_id, "Test deleteService")

        const deleted_service = await servicemodel.deleteOneService(service_id)
        if (deleted_service.rows[0].id) {
            const result = { success: "true" }
            res.json(result)
            console.log(deleted_service.rows, result)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

     //  ### Получить одно удобство ###
     async getService(req, res) { 
        const service_id = req.params.id
        console.log(service_id, "Test getService")
        const one_service = await servicemodel.getOneService(service_id)
        if (one_service.rows[0]) {
            const result = one_service.rows[0]
            res.json(result)
            console.log(one_service.rows)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

     //  ### Получить все удобства ###
     async getServices(req, res) { 
        console.log(req.params.id)
        const service_id = req.params.id
        console.log(service_id, "Test deleteService")

        const all_services = await servicemodel.getAllServices()
        if (all_services.rows[0]) {
            const result = all_services.rows
            res.json(result)
            console.log(all_services.rows)
        } else {
            const result = { success: "Error" }
            res.json(result)
        }
     }    

}

const service_controller = new ServiceControlller();
export { service_controller };