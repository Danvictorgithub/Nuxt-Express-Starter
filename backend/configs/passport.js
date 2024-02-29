require("dotenv").config();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { prisma } = require("../db/prisma");
// Note: You can use multiple passport strategies it is separated by
// passport.authenticate("local") or passport.authenticate("jwt") etc.

// Passport local is a passport strategy for Authentication INSIDE your back-end instead of using 3rd party like Auth0, Supabase Auth, or FireBase Auth etc.
passport.use(
  new LocalStrategy(async function (username, password, done) {
    // Checks if username and password is exactly correct
    // Might change this later when applying password encryption
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
    // The result query is empty then that means that either username and password is wrong
    if (!user || !bcrypt.compareSync(password, user.password)) {
      // Pattern if the authentication form is wrong, the third parameter indicates what is the message
      return done(null, false, { message: "Incorrect username or password" });
    }
    const { password: userPassword, ...userObj } = user;
    // Pattern if the authentication is correct, the third parameter indicates what is the message
    return done(null, userObj, { message: "Logged In Successfully" });
  })
);

let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || "secret";
passport.use(
  new JWTStrategy(opts, async function (jwt_payload, done) {
    const user = await prisma.user.findUnique({
      where: { id: jwt_payload.user.id, username: jwt_payload.user.username },
      select: { username: true, id: true }, // Excluding password
    });
    if (!user) {
      // if the token doesn't contain the user id and username
      return done(null, false);
    }
    // upon success the req.user is available to any next middleware or route handler
    return done(null, user);
  })
);
