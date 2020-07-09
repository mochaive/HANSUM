const PostModel = require("../models/post")
const logger = require("../config/logger")

const options = (req, res) => {
    res.header("Allow", "GET, PATCH, PUT, POST, DELETE, OPTIONS")
    res.sendStatus(200)
}

// 목록조회 (localhost:3000/api/posts?limit=10)
const list = (req, res) => {
    let limit = Number(req.query.limit) || 10

    if (isNaN(limit)) return res.status(400).end()

    PostModel.find({}, (err, posts) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        res.status(200).json(posts.slice(0, limit))
    })
}

// 상세조회 (localhost:3000/api/posts/:id)
const detail = (req, res) => {
    PostModel.findOne({ id: req.params.id }, (err, post) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        if (!post) {
            logger.warn("No Post")
            return res.status(404).send("No Post")
        }
        res.status(200).json(post)
    })
}

// 등록 (localhost:3000/api/posts)
const create = async (req, res) => {
    const { content, author, time, color, likes, public } = req.body

    const postData = new PostModel({
        content,
        author,
        time,
        color,
        likes,
        public,
    })

    await postData.save((err, post) => {
        if (err) {
            logger.error(err)
            return res.sendStatus(400)
        }
        res.status(201).json(post)
    })
}

// 등록 오류 (localhost:3000/api/posts/:id)
const createError = (req, res) => {
    logger.warn("Incorrect Domain")
    res.sendStatus(405)
}

// 수정 (localhost:3000/api/posts/:id)
const update = (req, res) => {
    const { content, author, time, color, likes, public } = req.body

    if (!content && !author) {
        logger.warn("Incorrect Input")
        res.sendStatus(400)
    }

    const postData = new PostModel({
        content,
        author,
        time,
        color,
        likes,
        public,
    })

    PostModel.findOneAndDelete({ id: req.params.id }, (err, post) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        if (!post) {
            logger.warn("No Post")
            return res.sendStatus(400)
        }

        postData.save((err, post) => {
            if (err) {
                logger.error(err)
                return res.sendStatus(400)
            }
            res.status(201).json(post)
        })
    })
}

// 일부 수정 (localhost:3000/api/posts/:id)
const patch = (req, res) => {
    PostModel.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { runValidators: true },
        (err, raw) => {
            if (err) {
                logger.error(err)
                return res.sendStatus(400)
            }
            if (!raw) {
                logger.warn("No Post")
                return res.status(404).send("No Post")
            }
            PostModel.findById(req.params.id, (err, post) => {
                if (err) {
                    logger.error(err)
                    return res.status(400)
                }
                if (!post) {
                    logger.warn("No Post")
                    return res.status(404).send("No Post")
                }
                res.status(200).json(post)
            })
        }
    )
}

// 전체 삭제 (localhost:3000/api/posts)
const erase = (req, res) => {
    PostModel.remove((err, info) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        res.status(200).json(info)
    })
}

// 선택 삭제 (localhost:3000/api/posts/:id)
const remove = (req, res) => {
    PostModel.findOneAndRemove({ id: req.params.id }, (err, post) => {
        if (err) {
            logger.error(err)
            return res.status(500).send("Error")
        }
        if (!post) {
            logger.warn("No Post")
            return res.status(404).send("No Post")
        }
        res.status(200).json(post)
    })
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
}
