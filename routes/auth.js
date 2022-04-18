const express = require('express');
const router = express.Router();
const passport = require('passport')
const jwt = require("jsonwebtoken");


router.get('/kakao', passport.authenticate('kakao'));

const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      console.log("콜백~~~")
      const { email, nickname } = user;
      const token = jwt.sign({ email, nickname }, 'my-key');
     
      result = {
        token,
        email: email,
        nickname: nickname,
      };
      console.log(result)
      res.send({ user: result });
    }
  )(req, res, next);
};
router.get("/kakao/callback", kakaoCallback);
module.exports = router;