const express = require("express")
const bodyParser = require("body-parser")
const createError = require("http-errors")
const logger = require("morgan")
require("dotenv").config()

const app = express()

// middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger("dev"))

app.get("/", (req, res, next) => {
    res.send("HANSUM-backend")
})

app.listen(process.env.PORT || 3000, () => console.log("Server running"))

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    console.error(err)

    res.status(err.status || 500).send(err.message || "Internal Server Error")
})
