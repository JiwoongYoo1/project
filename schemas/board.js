const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  comment_num: Number,
  nickname: String, 
  comment: String
});

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
  
  },
  name: {
    type: String,
    
  },
  password: {
    type: String,
    
  },
  content: {
    type: String,
    
  },
  date: {
    type: String,
          
  },
  num: {
    type: Number,    
    
  }, 
  like:{
    type: Number,
    default: 0
  
  },
  comment: [UserSchema]
});

module.exports = mongoose.model("Board", boardSchema);