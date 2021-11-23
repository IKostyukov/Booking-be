import {pool} from "../db.js";
import {user} from "../models/user_model.js";
import passport from 'passport';
import PassportLocal from 'passport-local';

const LocalStrategy = PassportLocal.Strategy;
console.log(LocalStrategy, "Tect of import LocalStrategy") // Работает
    

const local_strategy = new LocalStrategy(function(username, password, done) {
    consol.log("test user_authenticate") // Не работает
    user.findOne({ username: username }, function (err, user) {
    if (err) {  
            consol.log(err, "error  test user_authenticate")
            return done(err); 
        }
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
    });
});

export { local_strategy }