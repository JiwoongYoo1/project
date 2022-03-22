const express = require('express');
const connect = require('./schemas');
const app = express();
const port = 3000;

connect();

const boardsRouter = require("./routes/boards")

const requestMiddleWare = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
};

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleWare); 

app.use("/api", [boardsRouter]);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/board.html')
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

