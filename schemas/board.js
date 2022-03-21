const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true   
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    require : true,       
  },
  num: {
    type: Number,    
    requir: true,
    unique: true
  }
});

module.exports = mongoose.model("Board", boardSchema);