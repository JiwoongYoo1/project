const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({ 
  comment_num: Number,
  nickname: String,
  password: String,
  comment: String,
  userID : String,
  email : String,
 
  provider: {
    type: String,
  }
  
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);