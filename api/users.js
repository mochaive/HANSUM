const express = require("express")

const router = express.Router()

const controller = require("../controller/users")

router.options("/", controller.options)
router.get("/", controller.list) // 목록조회
router.get("/:uid", controller.detail) // 상세조회
router.post("/", controller.create) // 등록
router.post("/:uid", controller.createError) // 등록 에러
router.put("/:uid", controller.update) // 전체 수정
router.patch("/:uid", controller.patch) // 일부 수정
router.delete("/", controller.erase) // 전체 삭제, 개발자 남용 금지
router.delete("/:uid", controller.remove) // 선택 삭제

module.exports = router
