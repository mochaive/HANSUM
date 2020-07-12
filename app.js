const express = require("express")
const bodyParser = require("body-parser")
const createError = require("http-errors")
const logger = require("morgan")
const mongoose = require("mongoose")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
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

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.set("layout", "layout")
app.set("layout extractScripts", true)
app.use(expressLayouts)

// routing
app.use("/api", router)

app.get("/", (req, res, next) => {
    res.render("index")
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
