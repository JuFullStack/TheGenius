const express = require("express");
const router = express.Router();
const ctrl = require("./item.ctrl");

// 라우팅 설정
router.get("/", ctrl.list); //목록조희 /music
router.get("/new", ctrl.showCreatePage);
router.get("/:id/edit", ctrl.checkId, ctrl.showUpdatePage);
router.get("/:id", ctrl.checkId, ctrl.detail); //상세조회 /mucic/:id
router.post("/", ctrl.create); // 등록 (/music)
router.put("/:id", ctrl.checkId, ctrl.update); //수정 (/music/:id)
router.delete("/:id", ctrl.checkId, ctrl.remove); // 삭제 (/music/:id)

module.exports = router;
