const mongoose = require("mongoose");

const connect = () => {
    mongoose
      .connect("mongodb://localhost:27017/project", {ignoreUndefined: true})
      .catch(err => console.error());
  };

  module.exports = connect;
  