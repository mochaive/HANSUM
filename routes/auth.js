const express = require("express")

const router = express.Router()

const controller = require("../controller/auth")

// API
router.get("/", controller.login)
router.get("/google", controller.loginGoogle)
router.get("/google/callback", controller.loginGoogleCallback)
router.get("/logout", controller.authenticateUser, controller.logout)

module.exports = router
