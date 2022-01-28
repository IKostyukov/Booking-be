import express from 'express';
import { provider_controller } from '../controller/provider_controller.js';

const Router = express.Router;
const routerProviders = new Router();

 //  ### Providers ###

 routerProviders.post('/provider', provider_controller.createProvider);
 routerProviders.patch('/provider/:providerId/activation', provider_controller.activateProvider);
 routerProviders.patch('/provider/:providerId', provider_controller.updateProvider);
 routerProviders.delete('/provider/:providerId', provider_controller.deleteProvider);
 routerProviders.get('/provider/:providerId',  provider_controller.getProvider);
 routerProviders.get('/provider', provider_controller.getProviders);
 
                     //    Provider's top 10
 routerProviders.get('/providers/best', provider_controller.getBestProviders);
 
 
                   //      Provider's descriptions
 routerProviders.post('/provider/:providerId/description', provider_controller.createDescription);
 routerProviders.patch('/provider/:providerId/description/:descriptionId', provider_controller.updateDescription); // в теле запроса идёт массив;  тогда говорили, что в боди будет информация об одном описании
 routerProviders.delete('/provider/:providerId/description/:descriptionId', provider_controller.deleteDescription);
 routerProviders.get('/provider/:providerId/description/:descriptionId', provider_controller.getDescription);
 routerProviders.get('/provider/:providerId/descriptions', provider_controller.getAllDescriptions);
 
                    //     Provider's services
 routerProviders.patch('/provider/:providerId/services', provider_controller.addServicesToProvider);
 routerProviders.get('/provider/:providerId/services', provider_controller.getServicesOfProvider);
 
                     //   Provider's timetable
 routerProviders.post('/provider/:providerId/timetable', provider_controller.createTimetable);
 routerProviders.patch('/provider/:providerId/timetable', provider_controller.updateTimetable);
 routerProviders.delete('/provider/:providerId/timetable', provider_controller.deleteTimetable);
 routerProviders.get('/provider/:providerId/timetable', provider_controller.getTimetable);
 
                     //   Provider's extratimetable
 routerProviders.post('/provider/:providerId/extratimetable', provider_controller.createExtratimetable);
 routerProviders.patch('/provider/:providerId/extratimetable/:extratimetableId', provider_controller.updateExtratimetable);
 routerProviders.delete('/provider/:providerId/extratimetable/:extratimetableId', provider_controller.deleteExtratimetable);
 routerProviders.get('/provider/:providerId/extratimetable/:extratimetableId', provider_controller.getOneExtratimetable);
 routerProviders.get('/provider/:providerId/extratimetable', provider_controller.getAllExtratimetable);
 
                    //     Provider's equipment 
 routerProviders.post('/provider/:providerId/equipment', provider_controller.createEquipmentProvider); // called addEquipment in the Postman AND must add to route '/:equipmentId
 routerProviders.patch('/provider/:providerId/equipment/:equipmentId/activation', provider_controller.activateEquipmentProvider);
 routerProviders.patch('/provider/:providerId/equipment/:equipmentId', provider_controller.updateEquipmentProvider); //  equipmentId  в запросе  /provider/:providerId/equipment/:equipmentId это на самом деле equipmentprovider_id в коде
 routerProviders.delete('/provider/:providerId/equipment/:equipmentId', provider_controller.deleteEquipmentProvider);
 routerProviders.get('/provider/:providerId/equipment/:equipmentId', provider_controller.getOneEquipmentProvider);
 routerProviders.get('/provider/:providerId/equipment', provider_controller.getAllEquipmentProvider);
 
 
                     //   Provider's fares 
 routerProviders.post('/provider/:providerId/equipment/:equipmentId/fare', provider_controller.createFare);
 routerProviders.patch('/provider/:providerId/equipment/:equipmentId/fare/:fareId', provider_controller.updateFare);
 routerProviders.delete('/provider/:providerId/equipment/:equipmentId/fare/:fareId', provider_controller.deleteFare);
 routerProviders.get('/provider/:providerId/equipment/:equipmentId/fare/:fareId', provider_controller.getFare);
 routerProviders.get('/provider/:providerId/equipment/:equipmentId/fare', provider_controller.getFares);
 
 
                     //    Provider's promotions
 routerProviders.post('/provider/:providerId/equipment/:equipmentId/promotion', provider_controller.createPromotion);
 routerProviders.patch('/provider/:providerId/equipment/:equipmentId/promotion/:promotionId', provider_controller.updatePromotion);
 routerProviders.patch('/provider/:providerId/equipment/:equipmentId/promotion/:promotionId/activation', provider_controller.activatePromotion);
 routerProviders.delete('/provider/:providerId/equipment/:equipmentId/promotion/:promotionId', provider_controller.deletePromotion);
 routerProviders.get('/provider/:providerId/equipment/:equipmentId/promotion/:promotionId', provider_controller.getOnePromotion);
 routerProviders.get('/provider/:providerId/equipment/:equipmentId/promotion', provider_controller.getAllPromotions)
 
 
                    //     Provider's advantages
 routerProviders.post('/provider/:providerId/advantage', provider_controller.addAdvantageToProvider);
 routerProviders.delete('/provider/:providerId/advantage/:advantageId', provider_controller.deleteAdvantageFromProvider);
 
                   //      Provider's options
 // In the development...
 
  
 

export { routerProviders };