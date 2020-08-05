const mongoose = require("mongoose");
const user = require("./user");

//스키마 생성
const GamelogSchema = new mongoose.Schema({
  gamename: {
    type: String,
    required: true,
    trim: true,
  },
  me: {
    type: String,
    required: true,
    trim: true,
  },
  otheruser: {
    type: String,
    required: true,
    trim: true,
  },
  myscores: {
    type: Number,
    default: 0,
  },
  otherscores: {
    type: Number,
    default: 0,
  },
  garnetchange: {
    type: String,
    default: 0,
  },
  blackmission: {
    type: Boolean,
    default: false,
  },
  winner: {
    type: Boolean,
    default: true, //0 승리, 1 패배
  },
});

//스키마를 통해 모델 객체 생성
//mongoose.model("모델명", 스키마) ->모델명s
//mongoose.model("모델명", 스키마,"컬렉션명")
module.exports = mongoose.model("gamelog", GamelogSchema);
