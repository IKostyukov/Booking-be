import express from 'express';
import passport  from  'passport';
import jwt from 'jsonwebtoken';
import {local_strategy} from '../config/passport.js';
import {jwt_strategy} from '../config/passport.js';

// import {pool} from "../db.js";


const Router = express.Router;
const routerAccess = new Router();

   
const  mustAuthenticated = (req, res, next) => {  // Working
    console.log(req.session, req._passport, "req.session (routs.js-34)", 
    req.isAuthenticated, "req.isAuthenticated (routs.js-35")
    if (req.isAuthenticated()) { 
      console.log("OK mustAuthenticated")
      return next()
    }
    console.log("NOT OK mustAuthenticated")
    res.redirect("/login")
    // return res.status(400).send({Error: "NOT OK mustAuthenticated"})  
  }

  // ### Аутентификация

// routerAccess.post('/login',  // Working
//   // call passport authentication passing the "local" strategy name and a callback function
//   passport.authenticate('local', {session: false}),
//   //  function to call once successfully authenticated
//   function (req, res) {
//     console.log(req.headers, "req.hedars routes-45")
//     console.log(req.session, "req.session routes-46")
//     res.status(200).send(req.user);
//   });



// ### (Аутентификация local) 
//  То же самое для тестирования  с результатами ошибок в консоль 

// routerAccess.post('/login', function (req, res, next) {  // Working
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

  // ### Аутентификация, которая возвращает токен JWT  -Working

  // routerAccess.post('/login',  passport.authenticate('local', {session: false}), (req, res, next) => {
  //           req.login(req.user, { session: false }, async (error) => {  // Working
  //             if (error) return next(error);
  //             const body = { _id: req.user._id, email: req.user.email };
  //             const token = jwt.sign({ user: body }, 'TOP_SECRET');
  //             return res.json({ token });
  //           });        
  //   });
 
    // ### Аутентификация, которая возвращает токен JWT   -Working
    //  То же самое для тестирования  с результатами ошибок в консоль 
    
// routerAccess.post('/login', async (req, res, next) => {  // Working
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

// routerAccess.get('/provider/:id', passport.authenticate([ 'google' ]),provider_controller.getProvider); // Working
// routerAccess.get('/login', passport.authenticate(['google', 'facebook', 'jwt', 'session'  ]),provider_controller.getProvider); // Working
// routerAccess.get('/provider/:id', passport.authenticate(['jwt', 'google',  'facebook' ]  ),provider_controller.getProvider); // Working jwt + google with global scope
// routerAccess.get('/provider/:id', passport.authenticate('google', {scope: ['profile']} ),provider_controller.getProvider); // Working  google with scope
// routerAccess.get('/provider/:id', passport.authenticate(['jwt', 'facebook' ]  ),provider_controller.getProvider); // Working jwt + facebook
// routerAccess.get('/provider/:id', passport.authenticate(['jwt', 'session']),provider_controller.getProvider); // Working 


// При этом, все стратегии применяются с условием логическое ИЛИ. 
// Срабатывает первая из удачных стратегий. Если произошла ошибка, и ее обработали функцией done(err), 
// то дальше авторизация не проходит. 
// Поэтому во всех стратегиях, кроме последней в списке авторизации,
//  ошибка должна обрабтываться вызовом done(null, false).

// routerAccess.get('/provider/:id', passport.authenticate('jwt', { session: false }),provider_controller.getProvider); // Working
// routerAccess.get('/provider/:id', passport.authenticate('session'),provider_controller.getProvider); // Working
// routerAccess.get('/provider/:id', mustAuthenticated, provider_controller.getProvider); // Working 
// routerAccess.get('/provider/:id', async (req, res, next) => {  
//   console.log(req.user, req.session, req._passport, "from routs.js-130")      
//   passport.authenticate('session')(req, res, next);
//   },
//    provider_controller.getProvider);

// routerAccess.get('/provider/:id', async (req, res, next) => {
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


//  Тесты ##########

routerAccess.get('/', function(req, res) {
    res.send('Birds home page');
});
//  -----------

export {routerAccess};
export {mustAuthenticated}