import PassportLocal from "passport-local";
import PassportJwt from "passport-jwt";
import google_oauth from "passport-google-oauth20";
import facebook from "passport-facebook";
import { user } from "../models/user_model.js";

const LocalStrategy = PassportLocal.Strategy;
const JwtStrategy = PassportJwt.Strategy;
const JwtExstract = PassportJwt.ExtractJwt;
const GoogleStrategy = google_oauth.Strategy;
const FacebookStrategy = facebook.Strategy;

const JWTkey = "TOP_SECRET";
// const JWTkey = KeyJwt.secretJWTKey;

//  ### Local Strategy (Аутентификация)

console.log(LocalStrategy, "Tect of import LocalStrategy from passport.js"); // Работает

const local_strategy = new LocalStrategy(
  {
    usernameField: "last_name", // define the parameter in req.body that passport can use as username and password
    passwordField: "password",
  },
  function (username, password, done) {
    console.log(username, "test verification function called from passport.js"); // Петров
    try {
      user.findOne({ last_name: username }, function (err, user) {
        console.log(
          err,
          user,
          "test (err, user)  authenticate from passport.js"
        );

        if (err) {
          console.log(err, "test error user authenticate from passport.js");
          return done(err);
        }
        if (!user) {
          console.log(
            err,
            "test error {message: 'Incorrect username} from passport.js"
          );
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password != password) {
          console.log(
            err,
            "test error {message: 'Incorrect password} from passport.js"
          );
          return done(null, false, { message: "Incorrect password." });
        }

        console.log("test (Sucsess logged in) passport.js");
        return done(null, user);
      });
    } catch (err) {
      const error = new Api500Error("server.js", `${err.message}`);
      console.log(error);
    }
  }
);

// ### JWT Strategy (Авторизация по токену)

const options = {
  jwtFromRequest: JwtExstract.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTkey,
};
const jwt_strategy = new JwtStrategy(options, async (payload, done) => {
  const user = await user.findOne(payload);
  try {
    return done(null, payload.user);
  } catch (error) {
    done(error);
  }
});

//  ### GOOGLE

const google_strategy = new GoogleStrategy(
  {
    clientID:
      "637412737162-9lcg0qc8dv7s4e1l6p9ncjk4r0se84qc.apps.googleusercontent.com", //YOUR GOOGLE_CLIENT_ID
    clientSecret: "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", //YOUR GOOGLE_CLIENT_SECRET
    callbackURL: "http://127.0.0.1:8080/auth/google/callback",
    // 'https://www.getpostman.com/auth/google/callback',
    passReqToCallback: true,
    scope: ["profile", "email"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log(
        req.session,
        "accessToken --- ",
        accessToken,
        "refreshToken---",
        refreshToken,
        "profile ---",
        profile,
        "done ---",
        done
      );
      const found_user = await user.findByProfileId({ profile_id: profile.id });
      console.log(found_user.rows);
      return done(null, found_user.rows);
    } catch (err) {
      console.log(err, "catch (err) google from passport.js");
      // return done(err)
      return done(null, false);
    }
  }
);

// FACEBOOK

const facebook_strategy = new FacebookStrategy(
  {
    clientID: 618371092706205,
    clientSecret: "8d8244ea32da45a7340fa0b825c60c28",
    callbackURL: "http://localhost:8080/auth/facebook/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(
        "accessToken --- ",
        accessToken,
        "refreshToken---",
        refreshToken,
        "profile ---",
        profile,
        "done ---",
        done
      );
      const found_user = await user.findByProfileId({ profile_id: profile.id });
      console.log(
        found_user.rows,
        "found_user.rows in facebook_strategy passport.js"
      );
      return done(null, found_user.rows);
    } catch (err) {
      return done(null, false);
      //   return done(err)
    }
  }
);

export { local_strategy };
export { jwt_strategy };
export { google_strategy };
export { facebook_strategy };
