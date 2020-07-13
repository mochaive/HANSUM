const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
require("dotenv").config()

const googleCredentials = require("../config/google.json")

const UserModel = require("../models/user")

// passport setup
passport.use(
    new GoogleStrategy(
        {
            clientID: googleCredentials.web.client_id,
            clientSecret: googleCredentials.web.client_secret,
            callbackURL: "http://localhost:3000/routes/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, cb) => {
            cb(null, profile)
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(301).redirect("/routes/auth")
    }
}

const login = (req, res, next) => {
    res.render("login")
}

const loginGoogle = passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
})

const loginGoogleCallback = passport.authenticate("google", {
    failureRedirect: "/routes/auth",
    successRedirect: "/",
})

const logout = (req, res) => {
    req.session = null
    req.logout()
    res.redirect("/")
}

module.exports = {
    login,
    loginGoogle,
    loginGoogleCallback,
    logout,
    authenticateUser,
}
