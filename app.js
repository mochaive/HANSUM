const express = require("express")
const bodyParser = require("body-parser")
const createError = require("http-errors")
const logger = require("morgan")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const passport = require("passport")
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)
require("dotenv").config()

const router = require("./routes")
const auth = require("./controller/auth")

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
app.use(
    session({
        secret: "SECRET_CODE",
        cookie: { maxAge: 60 * 60 * 1000 },
        resave: true,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())

// socket.io
io.on("connection", (socket) => {
    let uid

    socket.on("post", (data) => {
        console.log("Message from %s", data.uid)
        console.log("data:", data.response)

        uid = data.uid

        let today = new Date()
        let hours = today.getHours() // 시

        if (
            data.response.time.startTime <= hours &&
            data.response.time.finishTime > hours
        ) {
            const msg = {
                from: {
                    uid: data.uid,
                },
                msg: data.response,
            }

            io.emit("post", msg)
        }
    })

    socket.on("forceDisconnect", () => {
        socket.disconnect()
    })

    socket.on("disconnect", () => {
        console.log("user disconnected: " + uid)
    })
})

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// routing
app.use("/routes", router)

app.get("/", auth.authenticateUser, (req, res, next) => {
    res.render("index", { uid: req.user.id })
})

server.listen(process.env.PORT || 3000, () => console.log("Server running"))

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    console.error(err)

    res.status(err.status || 500).send(err.message || "Internal Server Error")
})
