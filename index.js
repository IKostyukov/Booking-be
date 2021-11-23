import express from 'express';
import passport from 'passport';
// import passport  from  'passport-jwt';
import cors from 'cors';

import {user} from "./models/user_model.js";
import {router} from './routes/routes.js';
import {local_strategy} from './config/passport.js';

const Router = router
const port =  8080;
const app = express();

// app.use(passport.session());
app.use(passport.initialize());
passport.use('local', local_strategy);



// app.post('/login',
// user_authenticate.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     console.log(req.user.username, 'test of authenticate (req.user.username)')
//     res.redirect('/users/' + req.user.username);
//   });


app.use(cors({
    origin: ['http://localhost:4200']
}));

app.use(express.json());
app.use(express.urlencoded());
app.use('/', Router);
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