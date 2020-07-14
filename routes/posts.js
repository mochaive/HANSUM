const express = require("express")

const router = express.Router()

const controller = require("../controller/posts")
const auth = require("../controller/auth")

// API
router.get("/likes/:id", controller.like) // 공감 개수 조회
router.post("/likes/:id", controller.updateLike) // 공감 개수 수정
router.post("/like/:id", controller.isLike) // 공감 여부 확인
router.get("/write", auth.authenticateUser, controller.writePost)

// REST API
router.options("/", controller.options)
router.get("/ranking", controller.ranking)
router.get("/", controller.list) // 목록조회
router.get("/:id", controller.detail) // 상세조회
router.post("/", controller.create) // 등록
router.post("/:id", controller.createError) // 등록 에러
router.put("/:id", controller.update) // 전체 수정
router.patch("/:id", controller.patch) // 일부 수정
router.delete("/", controller.erase) // 전체 삭제, 개발자 남용 금지
router.delete("/:id", controller.remove) // 선택 삭제

module.exports = router
