const express = require("express")

const router = express.Router()

const postsRouter = require("./posts")
const usersRouter = require("./users")
const authRouter = require("./auth")

router.use("/posts", postsRouter)

router.use("/users", usersRouter)

router.use("/auth", authRouter)

module.exports = router
