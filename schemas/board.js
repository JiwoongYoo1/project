const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
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
  comment: [UserSchema]
});

module.exports = mongoose.model("Board", boardSchema);