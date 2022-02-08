import express from 'express';
import { provider_controller } from '../controller/provider_controller.js';
import { equipmentproviderFormCheck } from '../check_forms/equipmentprovider_form_check.js';
import { fareFormCheck } from '../check_forms/fare_form_check.js';
import { providerFormCheck } from '../check_forms/provider_form_check.js';
import { timetableFormCheck } from '../check_forms/timetable_form_check.js';
import { extratimetableFormCheck } from '../check_forms/extratimetable_form_check.js';

import { checkSchema } from 'express-validator';

const Router = express.Router;
const routerProviders = new Router();
const chesk_result = provider_controller.checkResult;


//  ### Providers ###

const check_form_create_provider = providerFormCheck.forCreate
const check_form_update_provider = providerFormCheck.forUpdate
const check_form_activate_provider = providerFormCheck.forActivate
const check_form_get_providers = providerFormCheck.forGetAll
const check_schema_provider = checkSchema(provider_controller.providerValidationSchema);

routerProviders.post('/provider', check_form_create_provider, check_schema_provider, chesk_result, provider_controller.createProvider);
routerProviders.patch('/provider/:providerId', check_form_update_provider, check_schema_provider, chesk_result, provider_controller.updateProvider);
routerProviders.patch('/provider/:providerId/activation', check_form_activate_provider, check_schema_provider, chesk_result, provider_controller.activateProvider);
routerProviders.delete('/provider/:providerId', check_schema_provider, chesk_result, provider_controller.deleteProvider);
routerProviders.get('/provider/:providerId', check_schema_provider, chesk_result, provider_controller.getOneProvider);
routerProviders.get('/provider', check_form_get_providers, check_schema_provider, chesk_result, provider_controller.getAllProviders);


//      Provider's top 10
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
const check_form_create_timetable = timetableFormCheck.forCreateUpdate
const check_form_update_timetable = timetableFormCheck.forCreateUpdate
const check_schema_timetable = checkSchema(provider_controller.timetableValidationSchema);

routerProviders.post('/provider/:providerId/timetable', check_form_create_timetable, check_schema_timetable, chesk_result, provider_controller.createTimetable);
routerProviders.patch('/provider/:providerId/timetable/:timetableId', check_form_update_timetable, check_schema_timetable, chesk_result, provider_controller.updateTimetable);
routerProviders.delete('/provider/:providerId/timetable/:timetableId', check_schema_timetable, chesk_result, provider_controller.deleteTimetable);
routerProviders.get('/provider/:providerId/timetable/:timetableId', check_schema_timetable, chesk_result, provider_controller.getTimetable);


//   Provider's extratimetable
const check_form_create_extratimetable = extratimetableFormCheck.forCreateUpdate
const check_form_update_extratimetable = extratimetableFormCheck.forCreateUpdate
const check_schema_extratimetable = checkSchema(provider_controller.extratimetableValidationSchema);

routerProviders.post('/provider/:providerId/extradate', check_form_create_extratimetable, check_schema_extratimetable, chesk_result, provider_controller.createExtratimetable);
routerProviders.patch('/provider/:providerId/extradate/:extradateId', check_form_update_extratimetable, check_schema_extratimetable, chesk_result, provider_controller.updateExtratimetable);
routerProviders.delete('/provider/:providerId/extradate/:extradateId', check_schema_extratimetable, chesk_result, provider_controller.deleteExtratimetable);
routerProviders.get('/provider/:providerId/extradate/:extradateId', check_schema_extratimetable, chesk_result, provider_controller.getOneExtratimetable);
routerProviders.get('/provider/:providerId/extradate', check_schema_extratimetable, chesk_result, provider_controller.getAllExtratimetable);


//     Provider's equipment 
const check_form_create_equipmentprovider = equipmentproviderFormCheck.forCreateUpdate
const check_form_update_equipmentprovider = equipmentproviderFormCheck.forCreateUpdate
const check_form_activate_equipmentprovider = equipmentproviderFormCheck.forActivate
const check_schema_equipmentprovider = checkSchema(provider_controller.equipmentproviderValidationSchema);

routerProviders.post('/provider/:providerId/equipment', check_form_create_equipmentprovider, check_schema_equipmentprovider, chesk_result, provider_controller.createEquipmentProvider); // called addEquipment in the Postman AND must add to route '/:equipmentId
routerProviders.patch('/provider/:providerId/equipment/:equipmentId/activation', check_form_activate_equipmentprovider, check_schema_equipmentprovider, chesk_result, provider_controller.activateEquipmentProvider);
routerProviders.patch('/provider/:providerId/equipment/:equipmentId', check_form_update_equipmentprovider, check_schema_equipmentprovider, chesk_result, provider_controller.updateEquipmentProvider); //  equipmentId  в запросе  /provider/:providerId/equipment/:equipmentId это на самом деле equipmentprovider_id в коде
routerProviders.delete('/provider/:providerId/equipment/:equipmentId', check_schema_equipmentprovider, chesk_result, provider_controller.deleteEquipmentProvider);
routerProviders.get('/provider/:providerId/equipment/:equipmentId', check_schema_equipmentprovider, chesk_result, provider_controller.getOneEquipmentProvider);
routerProviders.get('/provider/:providerId/equipment', check_schema_equipmentprovider, chesk_result, provider_controller.getAllEquipmentProvider);


//   Provider's fares                      
const check_create_form_fare = fareFormCheck.forCreateUpdate
const check_update_form_fare = fareFormCheck.forCreateUpdate
const check_schema_fare = checkSchema(provider_controller.fareValidationSchema);

routerProviders.post('/provider/:providerId/equipment/:equipmentId/fare', check_create_form_fare, check_schema_fare, chesk_result, provider_controller.createFare);
routerProviders.patch('/provider/:providerId/equipment/:equipmentId/fare/:fareId', check_update_form_fare, check_schema_fare, chesk_result, provider_controller.updateFare);
routerProviders.delete('/provider/:providerId/equipment/:equipmentId/fare/:fareId', check_schema_fare, chesk_result, provider_controller.deleteFare);
routerProviders.get('/provider/:providerId/equipment/:equipmentId/fare/:fareId', check_schema_fare, chesk_result, provider_controller.getFare);
routerProviders.get('/provider/:providerId/equipment/:equipmentId/fare', check_schema_fare, chesk_result, provider_controller.getFares);


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