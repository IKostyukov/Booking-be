import express from 'express';
import {router} from './routes/routes.js';
import cors from 'cors' 
const Router = router
const port =  8080;
const app = express();

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