const UserModel = require("../models/user")
const logger = require("../config/logger")

// OPTIONS
const options = (req, res) => {
    res.header("Allow", "GET, PATCH, PUT, POST, DELETE, OPTIONS")
    res.sendStatus(200)
}

// 목록조회 (localhost:3000/api/users?limit=10)
const list = (req, res) => {
    let limit = Number(req.query.limit) || 10

    if (isNaN(limit)) return res.status(400).end()

    UserModel.find({}, (err, users) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        res.status(200).json(users.slice(0, limit))
    })
}

// 상세조회 (localhost:3000/api/users/:uid)
const detail = (req, res) => {
    UserModel.findOne({ uid: req.params.uid }, (err, user) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        if (!user) {
            logger.warn("No User")
            return res.status(404).send("No User")
        }
        res.status(200).json(user)
    })
}

// 등록 (localhost:3000/api/users)
const create = async (req, res) => {
    const { uid, userName, imageUrl, likes, best } = req.body

    const userData = new UserModel({
        uid,
        userName,
        imageUrl,
        likes,
        best,
    })

    await userData.save((err, user) => {
        if (err) {
            logger.error(err)
            return res.sendStatus(400)
        }
        res.status(201).json(user)
    })
}

// 등록 오류 (localhost:3000/api/users/:uid)
const createError = (req, res) => {
    logger.warn("Incorrect Domain")
    res.sendStatus(405)
}

// 수정 (localhost:3000/api/users/:uid)
const update = (req, res) => {
    const { uid, userName, imageUrl, likes, best } = req.body

    if (!uid && !userName) {
        logger.warn("Incorrect Input")
        res.sendStatus(400)
    }

    const userData = new UserModel({
        uid,
        userName,
        imageUrl,
        likes,
        best,
    })

    UserModel.findOneAndRemove({ uid: req.params.uid }, (err, user) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        if (!user) {
            logger.warn("No User")
            return res.sendStatus(400)
        }

        userData.save((err, user) => {
            if (err) {
                logger.error(err)
                return res.sendStatus(400)
            }
            res.status(201).json(user)
        })
    })
}

// 일부 수정 (localhost:3000/api/users/:uid)
const patch = (req, res) => {
    UserModel.updateOne(
        { uid: req.params.uid },
        req.body,
        { runValidators: true },
        (err, raw) => {
            if (err) {
                logger.error(err)
                return res.sendStatus(400)
            }
            if (!raw) {
                logger.warn("No User")
                return res.status(404).send("No User")
            }
            UserModel.findOne({ uid: req.params.uid }, (err, user) => {
                if (err) {
                    logger.error(err)
                    return res.status(400)
                }
                if (!user) {
                    logger.warn("NO User")
                    return res.status(404).send("No User")
                }
                res.status(200).json(user)
            })
        }
    )
}

// 전체 삭제 (localhost:3000/api/users)
const erase = (req, res) => {
    UserModel.remove((err, info) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        res.status(200).json(info)
    })
}

// 선택 삭제 (localhost:3000/api/users/:uid)
const remove = (req, res) => {
    UserModel.findOneAndRemove({ uid: req.params.uid }, (err, user) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        if (!user) {
            logger.warn("No User")
            return res.status(404).send("No User")
        }
        res.status(200).json(user)
    })
}

const editUser = (req, res) => {
    res.render("user/edit", { uid: req.user.id })
}

module.exports = {
    options,
    list,
    detail,
    create,
    createError,
    update,
    patch,
    erase,
    remove,
    editUser,
}
