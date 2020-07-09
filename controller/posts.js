const PostModel = require("../models/post")

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
            return res.status(500).send("Error")
        }
        res.status(200).json(posts.slice(0, limit))
    })
}

// 상세조회 (localhost:3000/api/posts/:id)
const detail = (req, res) => {
    PostModel.findOne({ id: req.params.id }, (err, post) => {
        if (err) {
            return res.status(500).send("Error")
        }
        if (!post) {
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
            console.log(err)
            return res.sendStatus(400)
        }
        res.status(201).json(post)
    })
}

// 등록 오류 (localhost:3000/api/posts/:id)
const createError = (req, res) => {
    res.sendStatus(405)
}

// 수정 (localhost:3000/api/posts/:id)
const update = (req, res) => {
    const { content, author, time, color, likes, public } = req.body

    if (!content && !author) res.sendStatus(400)

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
            return res.status(500).send("Error")
        }
        if (!post) return res.sendStatus(400)

        postData.save((err, post) => {
            if (err) {
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
                return res.sendStatus(400)
            }
            if (!raw) return res.status(404).send("No Post")
            PostModel.findById(req.params.id, (err, post) => {
                if (err) {
                    return res.status(400)
                }
                if (!post) return res.status(404).send("No Post")
                res.status(200).json(post)
            })
        }
    )
}

// 전체 삭제 (localhost:3000/api/posts)
const erase = (req, res) => {
    PostModel.remove((err, info) => {
        if (err) {
            return res.status(500).send("Error")
        }
        res.status(200).json(info)
    })
}

// 선택 삭제 (localhost:3000/api/posts/:id)
const remove = (req, res) => {
    PostModel.findOneAndRemove({ id: req.params.id }, (err, post) => {
        if (err) {
            return res.status(500).send("Error")
        }
        if (!post) return res.status(404).send("No Post")
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
