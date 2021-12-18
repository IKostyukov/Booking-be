import express from 'express';
import passport  from  'passport';
import jwt from 'jsonwebtoken';
import {activity_controller} from '../controller/activity_controller.js';
import {equipment_controller} from '../controller/equipment_controller.js';
import { user_controller } from '../controller/user_controller.js';
import { provider_controller } from '../controller/provider_controller.js';
import { service_controller } from '../controller/service_controller.js';
import { booking_controller } from '../controller/booking_controller.js';
import { advantage_controller } from '../controller/advantage_controller.js';
import { message_controller } from '../controller/message_controller.js';
import { feedback_controller } from '../controller/feedback_controller.js';
import { rating_controller } from '../controller/rating_controller.js';
import {local_strategy} from '../config/passport.js';
import {jwt_strategy} from '../config/passport.js';

// import {pool} from "../db.js";


const Router = express.Router;
const router = new Router();

   
  function mustAuthenticated(req, res, next) {  // Working
    console.log(req.session, req._passport, "req.session (routs.js-34)", 
    req.isAuthenticated, "req.isAuthenticated (routs.js-35")
    if (!req.isAuthenticated()) {
      return res.status(400).send({foo: "!req.isAuthenticated" });
    }
    next();
  }

// router.post('/login',  // Working
//   // call passport authentication passing the "local" strategy name and a callback function
//   passport.authenticate('local', {session: false}),
//   //  function to call once successfully authenticated
//   function (req, res) {
//     console.log(req.headers, "req.hedars routes-45")
//     console.log(req.session, "req.session routes-46")
//     res.status(200).send(req.user);
//   });

  // ### Аутентификация? 

// router.post('/logout', mustAuthenticated, (req, res) => {  // Working
//   console.log(req.logOut);
//   res.send({'success' : "logout mustAuthenticated"});
// });

// ### (Аутентификация) 
//  То же самое для тестирования  с результатами ошибок в консоль 

// router.post('/login', function (req, res, next) {  // Working
//     // call passport authentication passing the "local" strategy name and a callback function
//     passport.authenticate('local', function (error, user, info) {
//       // this will execute in any case, even if a passport strategy will find an error
//       // log everything to console
//       console.log(req.body, "Test req res from routes.js-44");
//       console.log(error, "Test error from routes.js-45");
//       console.log(user, "Test user from routes.js-46");
//       console.log(info, "Test info from routes.js-47");

//       if (error) {
//         res.status(400).send(error);
//       } else if (!user) {
//         res.status(401).send(info);
//       } else {
//         next();
//       }
//       res.status(401).send(info);
//     })(req, res);
//   },
//   // function to call once successfully authenticated
//   function (req, res) {
//     res.status(200).send('logged in!');
//   });

  // ### Аутентификация, которая возвращает токен JWT

  router.post('/login',  passport.authenticate('local', {session: false}), (req, res, next) => {
            req.login(req.user, { session: false }, async (error) => {  // Working
              if (error) return next(error);
              const body = { _id: req.user._id, email: req.user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');
              return res.json({ token });
            });        
    });
 
    // ### Аутентификация, которая возвращает токен JWT   
    //  То же самое для тестирования  с результатами ошибок в консоль 
    
// router.post('/login', async (req, res, next) => {  // Working
//     passport.authenticate('local', {session: false}, async (err, user, info) => {
//         try {
//             console.log(req.body, "Test req res from routes.js-77");
//             console.log(err, "Test error from routes.js-78");
//             console.log(user, "Test user from routes.js-79");
//             console.log(info, "Test info from routes.js-80");
//             if (err || !user) {
//               const error = new Error('An error occurred.');
//               res.status(400).send(info);
//               console.log(info, "Test error rout.js-84")
//               return next(error);
//             }
//             req.login(user, { session: false }, async (error) => {  // Working
//               if (error) return next(error);
//               const body = { _id: user._id, email: user.email };
//               const token = jwt.sign({ user: body }, 'TOP_SECRET');
//               return res.json({ token });
//             });
//         } 
//         catch (error) {
//             return next(error);
//         }
//     })(req, res, next);
// },
// function (req, res) {
//         res.status(200).send('logged in!');
//       }
//     );    
  
    //  ### Защищенный маршрут  

// router.get('/provider/:id', passport.authenticate(['facebook', 'jwt', 'session', 'google' ]),provider_controller.getProvider); // Working
// router.get('/login', passport.authenticate(['google', 'facebook', 'jwt', 'session'  ]),provider_controller.getProvider); // Working
// router.get('/provider/:id', passport.authenticate(['jwt', 'google',  'facebook' ]  ),provider_controller.getProvider); // Working jwt + google with global scope
// router.get('/provider/:id', passport.authenticate('google', {scope: ['profile']} ),provider_controller.getProvider); // Working  google with scope
// router.get('/provider/:id', passport.authenticate(['jwt', 'facebook' ]  ),provider_controller.getProvider); // Working jwt + facebook
router.get('/provider/:id', passport.authenticate(['jwt', 'facebook', 'session' ]  ),provider_controller.getProvider); // Working jwt + facebook


// При этом, все стратегии применяются с условием логическое ИЛИ. 
// Срабатывает первая из удачных стратегий. Если произошла ошибка, и ее обработали функцией done(err), 
// то дальше авторизация не проходит. 
// Поэтому во всех стратегиях, кроме последней в списке авторизации,
//  ошибка должна обрабтываться вызовом done(null, false).

// router.get('/provider/:id', passport.authenticate('jwt', { session: false }),provider_controller.getProvider); // Working
// router.get('/provider/:id', passport.authenticate('session'),provider_controller.getProvider); // Working
// router.get('/provider/:id', mustAuthenticated, provider_controller.getProvider); // Working
// router.get('/provider/:id', async (req, res, next) => {  
//   console.log(req.user, req.session, req._passport, "from routs.js-130")      
//   passport.authenticate('session')(req, res, next);
//   },
//    provider_controller.getProvider);

// router.get('/provider/:id', async (req, res, next) => {
//   // Файлы cookie, которые не были подписаны 
//   console.log( 'Cookies: routs - 130' ,  req.cookies ) // cookie-parser не работает
//   // Файлы cookie, подписанные 
//   console.log( 'Подписанные файлы cookie: routs - 133' ,  req.signedCookies ) // cookie-parser не работает
//   const session = req.headers
//   console.log(session, "session from routs.js-136")
//   console.log(req.user, req.session, "_passport:", req._passport, " from routs.js-137")
      
//   passport.authenticate('jwt', async (err, user, info) => {
//           console.log(req.body, "Test req res from routes.js-139");
//           console.log(err, "Test error from routes.js-140");
//           console.log(user, "Test user from routes.js-141");
//           console.log(info, "Test info from routes.js-142");
//           if (err || !user) {
//             const error = new Error('An error occurred. roures.js-143');
//             res.status(400).send(info);
//             console.log(info, "Test error rout.js-146")
//             return next(error);
//           }
//           console.log(req.login, "req.login roters.js-148")
//           const session = req.headers
//           console.log(session, "session from routs.js-150")
//           return next()
//           // return res.json({session})
//           // req.login(user, { session: true }, async (error) => {
//           //   if (error) return next(error);
//             // const body = { _id: user._id, email: user.email };
//             // const token = jwt.sign({ user: body }, 'TOP_SECRET');
//             // return res.json({ token });
//           // });
      
//       if (error) {
//           return next(error);
//       }
//   })(req, res, next);
// },
// provider_controller.getProvider
//     );




// ### Пример из интернета (2013)
function setUserIDResponseCookie(req, res, next) { // Not working
  // if user-id cookie is out of date, update it
  if (req.user?.id != req.cookies["myapp-userid"]) {
      // if user successfully signed in, store user-id in cookie
      if (req.user) {
          res.cookie("myapp-userid", req.user.id, {
              // expire in year 9999 (from: https://stackoverflow.com/a/28289961)
              expires: new Date(253402300000000),
              httpOnly: false, // allows JS code to access it
          });
      } else {
          res.clearCookie("myapp-userid");
      }
  }
  next();
}
//  ### Provider

router.post('/provider', provider_controller.createProvider);
router.patch('/provider/:id/activation', provider_controller.activateProvider);
router.patch('/provider/:id', provider_controller.updateProvider);
router.delete('/provider/:id', provider_controller.deleteProvider);
// router.get('/provider/:id', provider_controller.getProvider);
router.get('/provider', provider_controller.getProviders);
router.get('/bestProviders', provider_controller.getBestProviders);

                //Provider's descriptions
router.post('/provider/:id/description', provider_controller.createDescription);
router.patch('/provider/:id/description', provider_controller.updateDescription);
router.delete('/provider/:id/description', provider_controller.deleteDescription);
router.get('/provider/:id/description/:id', provider_controller.getDescription);
router.get('/provider/:id/descriptions', provider_controller.getAllDescriptions);

                //Provider's services
router.patch('/provider/:id/services', provider_controller.addServicesToProvider);
router.get('/provider/:id/services', provider_controller.getServicesOfProvider);

                //Provider's advantages
router.post('/provider/:providerId/advantage/:advantageId', provider_controller.addAdvantageToProvider);
router.delete('/provider/:providerId/advantage/:advantageId', provider_controller.deleteAdvantageFromProvider);

//  ### Services

router.post('/service', service_controller.createService);
router.patch('/service/:id/activation', service_controller.activateService);
router.patch('/service/:id', service_controller.updateService);
router.delete('/service/:id', service_controller.deleteService);
router.get('/service/:id', service_controller.getService);
router.get('/service', service_controller.getServices);

//  ### Advantage

router.post('/advantage', advantage_controller.createAdvantage);
router.patch('/advantage/:id', advantage_controller.updateAdvantage);
router.patch('/advantage/:id/activation', advantage_controller.activateAdvantage);
router.delete('/advantage/:id', advantage_controller.deleteAdvantage);
router.get('/advantage/:id', advantage_controller.getAdvantage);
router.get('/advantage', advantage_controller.getAdvantages);

//  ### Activivies

router.post('/activity', activity_controller.createActivity);
router.patch('/activity/:id', activity_controller.updateActivity);
router.patch('/activity/:id/activation', activity_controller.activateActivity);
router.delete('/activity/:id', activity_controller.deleteActivity);
router.get('/activity/:id', activity_controller.getActivity);
router.get('/activities', activity_controller.getActivities);
router.get('/popularActivities', activity_controller.getPopularActivities);

//  ### Equipment

router.post('/equipment', equipment_controller.createEquipment);
router.patch('/equipment/:id', equipment_controller.updateEquipment);
router.patch('/equipment/:id/activation', equipment_controller.activateEquipment);
router.delete('/equipment/:id', equipment_controller.deleteEquipment);
router.get('/equipment/:id', equipment_controller.getEquipment);
router.get('/equipments', equipment_controller.getEquipments);

//  ### Equipment of provider

router.post('/equipmentprovider', provider_controller.createEquipmentProvider);
router.patch('/equipmentprovider/:id/activation', provider_controller.activateEquipmentProvider);
router.patch('/equipmentprovider/:id', provider_controller.updateEquipmentProvider);
router.delete('/equipmentprovider/:id', provider_controller.deleteEquipmentProvider);
router.get('/equipmentprovider/:id', provider_controller.getOneEquipmentProvider);
router.get('/equipmentprovider', provider_controller.getAllEquipmentProvider);

//  ### Fares 

router.post('/fare', provider_controller.createFare);
router.patch('/fare/:id', provider_controller.updateFare);
router.delete('/fare/:id', provider_controller.deleteFare);
router.get('/fare/:id', provider_controller.getFare);
router.get('/provider/:id/equipmentprovider/:id/fare', provider_controller.getFares);

//  ### Promotions

router.post('/promotion', provider_controller.createPromotion);
router.patch('/promotion/:id', provider_controller.updatePromotion);
router.patch('/provider/:providerId/equipmentprovider/:equipmentproviderId/promotion/:promotionId/activation', provider_controller.activatePromotion);
router.delete('/provider/:providerId/equipmentprovider/:equipmentproviderId/promotion/:promotionId', provider_controller.deletePromotion);
router.get('/provider/:id/equipmentprovider/:id/promotion/:id', provider_controller.getOnePromotion);
router.get('/provider/:id/equipmentprovider/:id/promotion', provider_controller.getAllPromotions);


//  ### Timetable

router.post('/timetable', provider_controller.createTimetable);
router.patch('/timetable/:id', provider_controller.updateTimetable);
router.delete('/timetable/:id', provider_controller.deleteTimetable);
router.get('/timetable/:id', provider_controller.getTimetable);

//  ### Extratimetable

router.post('/extratimetable', provider_controller.createExtratimetable);
router.patch('/extratimetable/:id', provider_controller.updateExtratimetable);
router.delete('/extratimetable/:id', provider_controller.deleteExtratimetable);
router.get('/extratimetable/:id', provider_controller.getOneExtratimetable);
router.get('/extratimetable', provider_controller.getAllExtratimetable);

//  ### Booking

router.post('/provider/:providerId/booking', booking_controller.createBooking);
router.patch('/provider/:providerId/booking/:bookingId', booking_controller.updateBooking);
router.patch('/provider/:providerId/booking/:bookingId/approval', booking_controller.approveBooking);
router.patch('/provider/:providerId/booking/:bookingId/cancellation', booking_controller.cancelBooking);
router.delete('/provider/:providerId/booking/:bookingId', booking_controller.deleteBooking);
router.get('/equipmentprovider/:equipmentproviderId/booking/:bookingId', booking_controller.getBooking);
router.get('/equipmentprovider/:equipmentproviderId/booking', booking_controller.getBookings);

//  ### Users

router.post('/user', user_controller.createUser);
router.post('/user/:id', user_controller.updateUser);
router.post('/user/:id/activation', user_controller.activateUser);
router.delete('/user/:id', user_controller.deleteUser);
router.get('/user/:id', user_controller.getUser);
router.get('/users', user_controller.getUsers);
router.post('/user/:userId/favoritequioment/:equipmentproviderId', user_controller.addFavoriteEquipment);
router.delete('/user/:userId/favoritequioment/:equipmentproviderId', user_controller.deleteFavoriteEquipment);
router.get('/user/:userId/favoritequioment', user_controller.getFavoriteEquipment);

//  ### Messages

router.post('/message', message_controller.createMessage);
router.patch('/message/:messageId', message_controller.updateMessage);
router.patch('/message/:messageId/activation', message_controller.activateMessage);
router.delete('/message/:messageId', message_controller.deleteMessage);
router.get('/messages', message_controller.getMessages);
router.get('/messagethreads', message_controller.getThreads);

//  ### Feedbaks

router.post('/feedback', feedback_controller.createFeedback);
router.patch('/feedback/:feedbackId', feedback_controller.updateFeedback);
router.patch('/feedback/:feedbackId/activation', feedback_controller.activateFeedback);
router.delete('/feedback/:feedbackId', feedback_controller.deleteFeedback);
router.get('/feedbacks', feedback_controller.getFeedbacks);

//  ### Ratings

router.post('/rating', rating_controller.addRate);
router.patch('/rating/:ratingId', rating_controller.updateRate);
router.delete('/rating/:ratingId', rating_controller.deleteRate);
router.post('/rating/:ratingId/message/:messageId', rating_controller.connectRatingToFeedback);

//  ### Searches

router.get('/searchEquipment', equipment_controller.getSearchEquipment);


//  Тесты ##########

router.get('/', function(req, res) {
    res.send('Birds home page');
});
//  -----------

export {router};