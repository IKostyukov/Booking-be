import express from 'express';
import passport from 'passport';
import expressSession from'express-session';
import cors from 'cors';
import cookieParser from'cookie-parser';
import connect_pg from 'connect-pg-simple';
import google_oauth from 'passport-google-oauth20';
import flash from 'connect-flash';



import {user} from "./models/user_model.js";
import {router} from './routes/routes.js';
import {secure_route} from './routes/secure-routes.js';
import {local_strategy} from './config/passport.js';
import {jwt_strategy} from './config/passport.js';
import {pool} from "./db.js";



const Router = router
const port =  8080;
const app = express();
const pgSession = connect_pg(expressSession);
const GoogleStrategy = google_oauth.Strategy;


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

// passport.deserializeUser((id = "Петров", done) => { // Test
//   console.log("")
//   user.findBiId({ user_id }).then((user) => {
//     console.log("")
//     done(null, user);
//     // return null;
//     return console.log("");
//   });
// });
passport.deserializeUser(function(user, done) {
  console.log(user, "deserializeUser from index.js-96") // Working
   done(null, user);
});

function checkAuth() {
  return app.use((req, res, next) => {
    if (req.user) next()
    // else res.redirect('/login')
    else res.send("Not auntithicated (Custom from index.js - 98)")
  })
};


passport.use('local', local_strategy);
passport.use('jwt',  jwt_strategy);

//  ### GOOGLE 

passport.use(
  new GoogleStrategy(
    {
      clientID: '637412737162-9lcg0qc8dv7s4e1l6p9ncjk4r0se84qc.apps.googleusercontent.com', //YOUR GOOGLE_CLIENT_ID
      clientSecret: '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', //YOUR GOOGLE_CLIENT_SECRET
      callbackURL: 
         'http://127.0.0.1:8080/auth/google/callback',        
      passReqToCallback   : true
       
       
    },
      // 'https://www.getpostman.com/auth/google/callback'
      //    'http://127.0.0.1:8080/auth/google/callback',

    (req, accessToken, refreshToken, profile, done) => {
      return done(null, profile)
    }
    // async (req, accessToken, refreshToken, profile, done) => {
    //   try {
    //     console.log(req.session,'accessToken --- ',accessToken, 'refreshToken---', refreshToken, 'profile ---', profile, 'done ---', done)
    //     const found_user = await user.findOneGoogle({ google_email: profile.emails[0].value })
    //     console.log(found_user)
    //     return done(null, found_user.toJSON())
    //   } catch (err) {
    //     return done(err)
    //   }
    // }
    )
);
  

app.get('/login', (req, res) => {
  res.send('Login page. Please, authorize.')
})

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

// app.get(
//   '/auth/google', (req, res, next) => {
//     console.log(req.body, "FFFFFFFFFFFF")
//   passport.authenticate('google', {
//     scope: ['profile'],
//   })(req, res, next)
//   // console.log(profile) //ReferenceError: profile is not defined
//   })

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/provider/107',
  })
)

// app.get('/provider/107', checkAuth(), (req, res) => {
//   res.send("Home page. You're authorized.")
// })

//  END GOOGLE

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