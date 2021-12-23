// Testing example

import express from 'express';

const Router = express.Router;
const router = new Router();

const secure_route = router.get(
    '/profile',
    (req, res, next) => {
    res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.headers.authorization
    })
    }
    );
export {secure_route};