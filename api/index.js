const express = require("express")

const router = express.Router()

const postsRouter = require("./posts")
const usersRouter = require("./users")

router.use("/posts", postsRouter)

router.use("/users", usersRouter)

module.exports = router
