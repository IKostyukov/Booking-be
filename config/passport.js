import {user} from "../models/user_model.js";
import passport from 'passport';
import PassportLocal from 'passport-local';
import PassportJwt from 'passport-jwt';
import KeyJwt from './config.json';

//  ### Local Strategy (Аутентификация)

const LocalStrategy = PassportLocal.Strategy;
console.log(LocalStrategy, "Tect of import LocalStrategy from passport.js-7") // Работает

const local_strategy = new LocalStrategy({
    usernameField: 'last_name',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
    },
    function(username, password, done) {
    console.log(username, "test verification function called from passport.js-15") // Петров

    user.findOne({ last_name: username }, function (err, user) {
    console.log(err, user, "test (err, user)  authenticate from passport.js-18")

    if (err) {  
        console.log(err, "test error user authenticate from passport.js-21")
        return done(err); 
        }        
    if (!user) {
        console.log(err, "test error {message: 'Incorrect username} from passport.js-25")
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password != password) {
        console.log(err, "test error {message: 'Incorrect password} from passport.js-29")
        return done(null, false, { message: 'Incorrect password.' });
    }

    console.log("test (Sucsess logged in) passport.js - 31")
    return done(null, user)    
    });
    });

// ### JWT Strategy (Авторизация по токену)

const JwtStrategy = PassportJwt.Strategy;
const JwtExstract = PassportJwt.ExtractJwt;
const JWTkey = 'TOP_SECRET'
// const JWTkey = KeyJwt.secretJWTKey;

const options = {
    jwtFromRequest: JwtExstract.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWTkey
}
const jwt_strategy = new JwtStrategy(options, async (payload, done) => {
    console.log(payload, "payload ---- passport.js- 52")
    // const user = await User.findOne(payload)
    try {
        return done(null, payload.user);
        } catch (error) {
        done(error);
        }   
});

export { local_strategy }
export { jwt_strategy }
