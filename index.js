import express from 'express';
import passport from 'passport';
import expressSession from'express-session';
import cors from 'cors';
import cookieParser from'cookie-parser';
import connect_pg from 'connect-pg-simple';


import flash from 'connect-flash';



import {user} from "./models/user_model.js";
import {router} from './routes/routes.js';
import {secure_route} from './routes/secure-routes.js';
import {local_strategy} from './config/passport.js';
import {jwt_strategy} from './config/passport.js';
import {google_strategy} from './config/passport.js';
import {facebook_strategy} from './config/passport.js';


import {pool} from "./db.js";



const Router = router
const port =  8080;
const app = express();
const pgSession = connect_pg(expressSession);


app.use(express.json());
app.use(express.urlencoded());
app.use(flash());
app.use(cors({
  origin: ['http://localhost:4200']
}));

// Middlewares, которые должны быть определены до passport:
//app.use(express.cookieParser()); //is no longer bundled with Express and must be installed separatel
// app.use(express.session({ secret: 'SECRET' })); //is no longer bundled with Express and must be installed separatel

 app.use(cookieParser());
//  app.use(expressSession({secret: 'keyboard cat'}))
app.use(expressSession({
  store: new pgSession({
    pool : pool,                // Connection pool
    // tableName : 'user_sessions'   // Use another table-name than the default "session" one
    // Insert connect-pg-simple options here
  }),
  secret: 'keyboard cat',
  resave: false,
  cookie: { 
    maxAge: 60*1000,
    // maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false
   } // 30 days
  // Insert express-session options here
}));

// Passport:
app.use(passport.initialize());
app.use(passport.session()); // passport.session() и session() - это разное

// app.use(passport.session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   }));

//   const sessionMiddleware = session({
//     secret: 'keyboard cat',
//     resave: true,
//     rolling: true,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 10 * 60 * 1000,
//       httpOnly: false,
//     },
//   });

// app.use(sessionMiddleware);

passport.serializeUser(function (user, done) {
  console.log(user, "serializeUser index-82") // Working
    done(null, user);
  });

passport.deserializeUser(function(user, done) {
  console.log(user, "deserializeUser from index.js-96") // Working
  done(null, user);
});

// passport.deserializeUser((id = "Петров", done) => { // Test
//   console.log("")
//   user.findBiId({ user_id }).then((user) => {
//     console.log("")
//     done(null, user);
//     // return null;
//     return console.log("");
//   });
// });

function checkAuth() {
  return app.use((req, res, next) => {
    if (req.user) next()
    // else res.redirect('/login')
    else res.send("Not auntithicated (Custom from index.js - 98)")
  })
};


passport.use('local', local_strategy);
passport.use('jwt',  jwt_strategy);
passport.use('google', google_strategy);
passport.use('facebook', facebook_strategy)

//  ### GOOGLE 
  
app.get('/login', (req, res) => { //Working
  res.send('Login page. Please, authorize.')
})

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    // successRedirect: '/provider/107',
  }),
  function(req, res) {
    // req.login(user, function(err) {
    //   if (err) { return res.redirect('/login'); }
      // res.redirect('/');
      console.log(req.user, "-0-------0-------------0----------0-")
      res.json(req.user);
        
    // })
  }
);

// app.get('/provider/107', checkAuth(), (req, res) => {
//   res.send("Home page. You're authorized.")
// })

  // ### FACEBOOK

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // req.login(user, function(err) {
    //   if (err) { return res.redirect('/login'); }
      // res.redirect('/');
      console.log(req.user, "-0-------0-------------0----------0-")
      res.json(req.user);
    // });
    // console.log(req.user, 'facebook callback index.js-205')
    // Successful authentication, redirect home.
    // res.redirect('/');
    // res.json(req.user) // req.user exists == {"id":"612308676651704","displayName":"Игорь Костюков","name":{},"provider":"facebook","_raw":"{\"name\":\"\\u0418\\u0433\\u043e\\u0440\\u044c \\u041a\\u043e\\u0441\\u0442\\u044e\\u043a\\u043e\\u0432\",\"id\":\"612308676651704\"}","_json":{"name":"Игорь Костюков","id":"612308676651704"}}
  });                  // It is facebook user - not our database


app.use('/', Router);
// app.use('/user',  passport.authenticate('jwt', { session: false }), secure_route);
// app.get('/user', checkAuth(), (req, res) => {
//     res.send("Home page. You're authorized.")
//   });
app.get('/test', function (req, res) { // Working
  console.log(req.session.id);
  console.log(req.session.cookie);
  console.log(req.user);
  console.log(req.isAuthenticated);
  res.sendStatus(200);
});


//  -- Working login (midleweare) and create sesion --

// app.post('/login', passport.authenticate('local'), function(req, res) {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   console.log(req.user.last_name, '(req.user.last_name) -  test of authenticate ')
//   // res.redirect('/users/' + req.user.username);
//   return res.send('Login successful');
// });


//  -- Working login (not midleweare) and create sesion --

// app.post('/login',   
//     function(request, response, next) {
//         console.log(request.session)
//         passport.authenticate('local', 
//         function(err, user, info) {
//             if(!user){ response.send(info.message);}
//             else{
//                 request.login(user, function(error) {
//                     if (error) return next(error);
//                     console.log("request.session:",request.session, 'request.user:',request.user, "Request Login supossedly successful. index-132");
//                     return response.send('Login successful');
//                 });
//                 //response.send('Login successful');
//             }
//         })(request, response, next);
//     }
// );



app.listen(port, () => console.log(`server started on port ${port}`))






// Сервер через Node.js

// const http = require('http');
// const hostname = '127.0.0.1';
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
//   });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
//   });


// Создать свое  событие

// var events = require('events');
// var myEmit = new events.EventEmitter();
// 
// myEmit.on('some', function(text) {
    // console.log(text);
// });
// 
// myEmit.emit('some', 'Работает');