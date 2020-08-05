const mongoose = require("mongoose");

//스키마 생성
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: Number,
    default: 0, //0 == 일반 사용자, 1 == 관리자
  },
  token: {
    type: String,
  },
  clear: {
    type: Number,
    default: 0,
  },
  garnet: {
    type: Number,
    default: 1,
  },
  bgarnet: {
    type: Number,
    default: 0,
  },
  chips: {
    type: Number,
    default: 0,
  },
  max_garnet: {
    type: Number,
    default: 0,
  },
  bestrank: {
    type: String,
    default: "brank",
  },
  currentrank: {
    type: String,
    default: "brank",
  },
  lastrank: {
    type: String,
    default: "brank",
  },
  blackmissions: {
    type: Number,
    default: 0,
  },
  blackmission_success: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  expert_game: {
    type: String,
    default: "없음",
  },
  playtimes: {
    type: Number,
    default: 0,
  },
});

//스키마를 통해 모델 객체 생성
//mongoose.model("모델명", 스키마) ->모델명s
//mongoose.model("모델명", 스키마,"컬렉션명")
module.exports = mongoose.model("user", UserSchema);
