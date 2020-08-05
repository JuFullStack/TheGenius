// 라우팅 모듈 작성
const express = require("express");
const router = express.Router();

const ctrl = require("./game.ctrl");

// 목록조회
router.get("/", ctrl.list);
router.get("/gyeolhap", ctrl.gyeolhap);
//router.get("/finddraw", ctrl.OnlineGame);
router.get("/deathmatch", ctrl.playMatch);
router.get("/play", ctrl.playGame);
router.get("/new", ctrl.showCreatePage);
router.get("/:id/edit", ctrl.checkId, ctrl.showUpdatePage);

// 상세조회
router.get("/:id", ctrl.checkId, ctrl.detail);

// 등록
router.post("/", ctrl.create);

// 수정
router.put("/:id", ctrl.checkId, ctrl.update);

// 삭제
router.delete("/:id", ctrl.checkId, ctrl.remove);
module.exports = router;
