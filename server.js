import express from "express";
import passport from "passport";
import expressSession from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect_pg from "connect-pg-simple";
import flash from "connect-flash";
import i18n from "./i18n.js";

import { local_strategy } from "./config/passport.js";
import { jwt_strategy } from "./config/passport.js";
import { google_strategy } from "./config/passport.js";
import { facebook_strategy } from "./config/passport.js";
import { mustAuthenticated } from "./routes/access_routes.js";

import { routerAccess } from "./routes/access_routes.js";
import { routerActivities } from "./routes/activity_routes.js";
import { routerAdvantages } from "./routes/advantage_routes.js";
import { routerBookings } from "./routes/booking_routes.js";
import { routerEquipments } from "./routes/equipment_routes.js";
import { routerFeedbaks } from "./routes/feedback_routes.js";
import { routerMessages } from "./routes/message_routes.js";
import { routerNotifications } from "./routes/notification_routes.js";
import { routerProviders } from "./routes/provider_routes.js";
import { routerRatings } from "./routes/rating_routes.js";
import { routerSearches } from "./routes/search_routes.js";
import { routerServices } from "./routes/service_routes.js";
import { routerUsers } from "./routes/user_routes.js";

import { secure_route } from "./routes/secure-routes.js"; //Tect

import { pool } from "./db.js";
import { user } from "./models/user_model.js";
import Api500Error from "./errors/api500_error.js";

try {
  // const Router = router
  const port = 8080;
  const app = express();
  const pgSession = connect_pg(expressSession);

  app.use(i18n);
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(flash());
  app.use(
    cors({
      origin: ["http://localhost:4200"],
    })
  );

  // Middlewares, которые должны быть определены до passport:
  //app.use(express.cookieParser()); //is no longer bundled with Express and must be installed separatel
  // app.use(express.session({ secret: 'SECRET' })); //is no longer bundled with Express and must be installed separatel

  app.use(cookieParser());
  app.use(
    expressSession({
      store: new pgSession({
        pool: pool, // Connection pool
        // tableName : 'user_sessions'   // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
      }),
      secret: "keyboard cat",
      resave: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: false,
      }, // 30 days
      // Insert express-session options here
    })
  );

  // Passport:
  app.use(passport.initialize());
  app.use(passport.session()); // passport.session() и session() - это разное

  passport.serializeUser(function (user, done) {
    console.log(user, "serializeUser server-110"); // Working
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log(user, "deserializeUser from server.js-115"); // Working
    done(null, user);
  });

  passport.use("local", local_strategy);
  passport.use("jwt", jwt_strategy);
  passport.use("google", google_strategy);
  passport.use("facebook", facebook_strategy);

  //  ### GOOGLE

  app.get("/login", (req, res) => {
    //Working
    res.send("Login page. Please, authorize.");
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      // successRedirect: '/provider/107',
    }),
    function (req, res) {
      req.login(user, function (err) {
        if (err) {
          return res.redirect("/login");
        }
        res.redirect("/");
      });
    }
  );

  // ### FACEBOOK

  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function (req, res) {
      req.login(user, function (err) {
        if (err) {
          return res.redirect("/login");
        }
        res.redirect("/");
      });
      console.log(req.user, "facebook callback index.js-205");
      //   Successful authentication, redirect home.
      res.redirect("/");
      res.json(req.user);
    }
  );

  //  -- Working LOGIN (not midleweare) and create sesion --

  app.post("/login", function (request, response, next) {
    console.log(request.session);
    passport.authenticate("local", function (err, user, info) {
      if (!user) {
        response.send(info.message);
      } else {
        request.login(user, function (error) {
          if (error) return next(error);
          console.log(
            "request.session:",
            request.session,
            "request.user:",
            request.user,
            "Request Login supossedly successful. index-212"
          );
          return response.send("Login successful");
        });
        //response.send('Login successful');
      }
    })(request, response, next);
  });

  app.post("/logout", (req, res) => {
    // Working
    req.logOut();
    res.redirect("/ login");
    console.log(`-------> Пользователь вышел из системы`);
  });

  // app.use('/', Router);
  app.use("/", mustAuthenticated, routerAccess);
  app.use("/", mustAuthenticated, routerActivities);
  app.use("/", mustAuthenticated, routerAdvantages);
  app.use("/", mustAuthenticated, routerBookings);
  app.use("/", mustAuthenticated, routerEquipments);
  app.use("/", mustAuthenticated, routerFeedbaks);
  app.use("/", mustAuthenticated, routerMessages);
  app.use("/", mustAuthenticated, routerNotifications);
  app.use("/", mustAuthenticated, routerProviders);
  app.use("/", mustAuthenticated, routerRatings);
  app.use("/", mustAuthenticated, routerSearches);
  app.use("/", mustAuthenticated, routerServices);
  app.use("/", mustAuthenticated, routerUsers);

  // tests
  app.use(
    "/user",
    passport.authenticate("jwt", { session: true }),
    secure_route
  );
  app.get("/test", function (req, res) {
    // Working
    console.log(req.session.id);
    console.log(req.session.cookie);
    console.log(req.user);
    res.sendStatus(200);
  });

  app.listen(port, () => console.log(`server started on port ${port}`));
} catch (err) {
  const error = new Api500Error("server.js", `${err.message}`);
  console.log(error);
}
