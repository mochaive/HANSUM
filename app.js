const express = require("express")
const bodyParser = require("body-parser")
const createError = require("http-errors")
const logger = require("morgan")
const mongoose = require("mongoose")
require("dotenv").config()

const router = require("./api")

const app = express()

// mongoDB connect
mongoose.connect("mongodb://localhost/hansum", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
mongoose.set("useCreateIndex", true)
const db = mongoose.connection
db.on("error", console.error)
db.once("open", () => {
    console.log("Connected to mongod server")
})

// middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger("dev"))

// routing
app.use("/api", router)

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
