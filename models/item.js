const mongoose = require("mongoose");

//스키마 생성
const ItemSchema = new mongoose.Schema({
  itemid: {
    type: String,
    required: true,
    trim: true,
  },
  itemname: {
    type: String,
    required: true,
    trim: true,
  },
  itemvalue: {
    type: String,
    required: true,
    trim: true,
  },
  howgame: {
    type: String,
    required: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

//스키마를 통해 모델 객체 생성
//mongoose.model("모델명", 스키마) ->모델명s
//mongoose.model("모델명", 스키마,"컬렉션명")
module.exports = mongoose.model("item", ItemSchema);
