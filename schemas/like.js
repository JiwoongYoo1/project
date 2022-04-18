const mongoose = require("mongoose");


const likeSchema = new mongoose.Schema({
  nickname:{
    type: String,
  },
  num: {
    type: Number,    
    
  }, 
  like:{
    type: Number,  
  } 
});

module.exports = mongoose.model("Like", likeSchema);