const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../../models/user");

const showSignupPage = (req, res) => {
  res.render("user/signup");
};

// 회원가입
// 성공 : 201 응답 (Created - 정상 등록됨), 필요한 경우 생성된 유저 객체 반환
// 실패 : 필수 입력 값이 누락될 경우 400 리턴 (400 Bad Request)
//       이미 등록된 이메일인 경우 409 리턴 (409 Conflict)
const signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).send("필수 값을 입력하지 않았습니다");

  UserModel.findOne({ email }, (err, result) => {
    if (err) return res.status(500).send("회원가입 중 오류가 발생하였습니다");
    if (result) return res.status(409).send("이미 사용중인 이메일입니다");

    // 단방향 해시 함수
    const saltRounds = 10; // salt 자릿수 지정
    bcrypt.hash(password, saltRounds, (err, hash) => {
      // Store hash in your password DB.
      if (err) return res.status(500).send("암호화 도중 오류가 발생하였습니다");

      const user = new UserModel({ name, email, password: hash });

      user.save((err, result) => {
        if (err) res.status(500).send("등록 중 오류가 발생하였습니다");
        res.status(201).json(result);
      });
    });
  });
};

const showLoginPage = (req, res) => {
  res.render("user/login");
};

const showMyPage = (req, res) => {
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
      res.render("user/mypage", { result });
    });
  });
};

// 로그인
// 성공 : 이메일과 비밀번호가 동일한 경우 (200)
// 실패 : 필수 입력값이 없는 경우 (400 Bad Request)
//       이메일 자체가 없는 경우 (404 Not Found)
//       비밀번호가 동일하지 않은 경우 (404 Not Found)

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("필수 값을 입력하지 않았습니다");
  UserModel.findOne({ email }, (err, user) => {
    if (err)
      return res.status(500).send("사용자 조회 중 오류가 발생하였습니다");
    if (!user) return res.status(404).send("가입하지 않은 이메일 입니다");

    // 비밀번호 정합성 체크 (암호화된 것 끼리 비교)
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).send("암호화 처리 중 오류가 발생했습니다");
      if (!isMatch) return res.status(404).send("비밀번호가 일치하지 않습니다");

      // 비밀번호가 일치한다면 Signed 토큰 발급 (JWT)
      const token = jwt.sign(user._id.toHexString(), "secretToken");
      console.log(token);

      UserModel.findByIdAndUpdate(user._id, { token }, (err, result) => {
        if (err) res.status(500).send("로그인 중 에러가 발생하였습니다");

        // 토큰 저장 : 쿠키, 로컬스토리지
        res.cookie("token", token, { httpOnly: true });
        res.json(result);
      });
    });
  });
};

// 모든 요청에 대해 토큰 정합성 체크
const checkAuth = (req, res, next) => {
  console.log("checkAuth start");
  // 모든 화면에서 공통으로 보여지는 값이 있는 경우
  //res.locals = {};
  res.locals.user = null;
  console.log(res.locals);

  // 쿠키에서 토큰 가져오기
  const token = req.cookies.token;

  if (!token) {
    // 정상적으로 토큰이 없는 경우
    if (
      req.url === "/" ||
      req.url === "/api/user/signup" ||
      req.url === "/api/user/login"
    )
      return next();
    // 비정상적으로 토큰이 없는 경우
    else return res.render("user/login");
  }

  // 토큰 정합성 체크 (토큰이 있는 경우)
  jwt.verify(token, "secretToken", (err, _id) => {
    if (err) {
      res.clearCookie("token");
      return res.render("user/login");
    }
    // token과 디비 토큰 비교
    UserModel.findOne({ _id, token }, (err, result) => {
      console.log(err);
      if (err) res.status(500).send("사용자 인증 시 오류가 발생했습니다");
      if (!result) return res.render("user/login");
      res.locals.user = { name: result.name, role: result.role };
      next();
    });
  });
};

const logout = (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, "secretToken", (err, _id) => {
    if (err) return res.status(500).send("로그아웃 시 오류가 발생하였습니다");
    UserModel.findByIdAndUpdate(_id, { token: "" }, (err, result) => {
      if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다");
      res.clearCookie("token");
      res.redirect("/");
    });
  });
};

module.exports = {
  showSignupPage,
  showLoginPage,
  signup,
  login,
  checkAuth,
  logout,
  showMyPage,
};
