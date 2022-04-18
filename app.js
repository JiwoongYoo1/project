const express = require('express');
const connect = require('./schemas');
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");
const session = require('express-session');
const app = express();
const port = 3000;
const passportConfig = require("./passport");
connect();
passportConfig();

const boardsRouter = require("./routes/boards")
const authRouter = require("./routes/auth")
const requestMiddleWare = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
};

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleWare); 

app.use("/api", [boardsRouter]);
app.use("/auth", authRouter);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/board.html')
}); 

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html')
}); 

app.get('/sign', (req, res) => {
  res.sendFile(__dirname + '/static/sign.html')
}); 

app.get('/write', (req, res) => {
  res.sendFile(__dirname + '/static/write.html')
});

app.get('/board', (req, res) => {
  res.sendFile(__dirname + '/static/view.html')
});

app.get('/board/edit', (req, res) => {
  res.sendFile(__dirname + '/static/edit.html')
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

