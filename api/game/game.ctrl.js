const GameModel = require("../../models/game");
const UserModel = require("../../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

// 목록조회 (localhost:3000/api/game?limit=2)
// - 성공 : limit 수만큼 game 객체를 담은 배열을 리턴 (200: OK)
// - 실패 : limit가 숫자가 아닌 경우 (400: Bad Request)
const list = (req, res) => {
  const limit = parseInt(req.query.limit || 10);

  if (Number.isNaN(limit)) {
    return res.status(400).end("숫자가 아님");
  }
  GameModel.find((err, result) => {
    if (err) return res.status(500).end();
    //res.json(result);
    res.render("game/list", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

// 상세조회 (localhost:3000/api/game/:id)
// - 성공 : id에 해당하는 game 객체 리턴 (200 : OK)
// - 실패 : id 유효하지 않은 경우 (400 : Bad Request)
//          해당하는 id가 없는 경우 (404 : Not Found)
const detail = (req, res) => {
  const id = req.params.id;

  // id로 조회
  GameModel.findById(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    //res.json(result);
    res.render("game/detail", { result });
  });
};

// 등록(localhost:3000/api/game)
// 성공 : 등록한 game 객체를 리턴 (201: Created)
// 실패 : singer, title 값 누락 시 400 반환 (400: Bad Request)
const create = (req, res) => {
  const { gameid, gamename, theme } = req.body;
  if (!gameid || !gamename || !theme) return res.status(400).end();

  // 2. Model. create()
  GameModel.create({ gameid, gamename, theme }, (err, result) => {
    if (err) return res.status(500).end();
    res.status(201).json(result);
  });
};

// 수정 (/game/:id)
// 성공 : id에 해당하는 game 객체에 입력 데이터로 변경
//        해당 객체를 반환 (200:OK)
// 실패 : 유효한 id가 아닐 경우 (400: Bad Request)
//        해당하는 id가 없는 경우 (404: Not Found)
const update = (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  const { gameid, gamename, theme } = req.body;

  GameModel.findByIdAndUpdate(
    id,
    { gameid, gamename, theme },
    { new: true },
    (err, result) => {
      if (err) return res.status(500).end(); //throw error!!
      if (!result) return res.status(404).end();
      res.json(result);
    }
  );
};

// 삭제 (localhost:3000/api/game/:id)
// 성공 : id에 해당하는 객체를 배열에서 삭제 후 결과 배열 리턴(200: OK)
// 실패 : id가 숫자가 아닌 경우(400: Bad Request)
//        해당하는 id가 없는 경우 (404: Not Found)
const remove = (req, res) => {
  const id = req.params.id;

  // 삭제 처리
  GameModel.findByIdAndDelete(id, (err, result) => {
    if (err) return res.status(500).end(); //throw error!!
    if (!result) return res.status(404).end();
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  res.render("game/create");
};

const playGame = (req, res) => {
  const limit = parseInt(req.query.limit || 10);

  if (Number.isNaN(limit)) {
    return res.status(400).end("숫자가 아님");
  }
  GameModel.find((err, result) => {
    if (err) return res.status(500).end();
    //res.json(result);
    res.render("game/play", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

const playMatch = (req, res) => {
  const limit = parseInt(req.query.limit || 10);

  if (Number.isNaN(limit)) {
    return res.status(400).end("숫자가 아님");
  }
  GameModel.find((err, result) => {
    if (err) return res.status(500).end();
    //res.json(result);
    res.render("game/deathmatch", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

const gyeolhap = (req, res) => {
  res.render("game/gyeolhap");
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;
  GameModel.findById(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.stauts(404).end();
    res.render("game/update", { result });
  });
};

const BandW = (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, "secretToken", (err, _id) => {
    if (err) {
      res.clearCookie("token");
      return res.render("user/login");
    }
    // token과 디비 토큰 비교
    UserModel.findOne({ _id, token }, (err, result) => {
      console.log(err);
      if (err) res.status(500).send("사용자 인증 시 오류가 발생했습니다");
      console.log(result);
      if (!result) return res.render("user/login");
      res.render("game/blackorwhite", { result, username: result.name });
    });
  });
};

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  checkId,
  showCreatePage,
  showUpdatePage,
  playGame,
  playMatch,
  gyeolhap,
  BandW,
};
