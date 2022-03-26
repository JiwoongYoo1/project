const express = require('express');
const Board = require('../schemas/board')
const User = require('../schemas/user')
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");

router.get('/', (req, res) => {
	res.send('this is root page');
});

router.get('/board', async (req, res) => {
	const {num} = req.query;	
	console.log(num)

	const board = await Board.find({num});
	res.json({
		board
	});
});

router.get("/board/:num", async (req, res) => {
	const { num } = req.params;	

	const [board] = await Board.find({ num: Number(num) });

	res.json({
		board,  
	});
});


router.delete("/board/:num",authMiddleware, async(req, res) =>{
	const { num } = req.params;	
	const { password } = req.body;

	
	const existBoard = await Board.find({num: Number(num), password: password});

	if(existBoard.length){
		await Board.deleteOne({ num: Number(num)});
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."
			
		});	
	}

	res.json({success: "삭제가 완료되었습니다!"});
});

router.put("/board/:num",authMiddleware, async (req, res)=>{
	const { num } = req.params;	
	const { title } = req.body;
	const { content } = req.body;
	const { name } = req.body;
	const { password } = req.body;

	const existBoard = await Board.find({num: Number(num), password: password});	

	if(existBoard.length){
		await Board.updateOne({num: Number(num)}, { $set: {title, content, name }}) 	
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."	
		});	
	}
	
	 res.json({success: "수정이 완료되었습니다!"})
})



router.post("/board",authMiddleware, async (req, res) => {	
	
	var today = new Date();
	var date = today.toLocaleString()		

	const { title, name, password, content } = req.body;	
	
	var num = 0
	const Post_ls = await Board.find();		
	if(Post_ls.length){
		num = Post_ls[Post_ls.length-1]['num'] + 1
	}else{
		num = 1
	}
	if( !title || !password || !content ){
		return res.status(400).json({
			errorMessage: "빈칸 없이 모두 입력해주세요"	
		});	
	}	
	const createdBoard = await Board.create({ title, name, password, content, num, date });
	
	res.json({ board : "등록 완료!!" });
});

router.post("/sign", async (req, res) => {
	const { nickname, password, confirm } = req.body;		

	const allowedWords = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v",
    "w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4",
    "5","6","7","8","9"]
	for(const word of nickname.split('')){
		if(!allowedWords.includes(word)){
			res.status(400).send({
				errorMessage: "닉네임 조건이 맞지 않습니다.",
			  });
			  return;
		}
	}
	if(nickname.length<3 ){		
		res.status(400).send({
			errorMessage: "닉네임 조건이 맞지 않습니다.",
		  });
		  return;
		}
	if(password.length < 4){
		res.status(400).send({
			errorMessage: "비밀번호는 4글자 이상으로 입력해야 합니다. ",
			});
			return;
		}

	if ( password !== confirm) {
		res.status(400).send({
		  errorMessage: "패스워드가 패스워드 확인란 일치하지 않습니다..",
		});
		return;
	  }
	  
	  // nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
	  const existsUsers = await User.findOne({nickname});
	  if (existsUsers) {
		// NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
		res.status(400).send({
		  errorMessage: "동일한 닉네임이 이미 사용중입니다.",
		});
		return;
	  }

		
	await User.create({ nickname, password });
	
	res.json({ msg : "가입을 축하드립니다!!" });
});

router.post("/login", async (req, res) => {
	try {
	  const { nickname, password } = req.body;	
  
	  const user = await User.findOne({nickname: nickname});
  
	  if (!user || password !== user.password) {
		res.status(400).send({
		  errorMessage: "닉네임 또는 패스워드를 확인해주세요",
		});
		return;
	  }
  
	  const token = jwt.sign({ userId: user.userId}, "my-secret-key");
	  console.log(token)
	  res.send({
		token, msg:"로그인에 성공하셨습니다"
	  });
	} catch (err) {
		console.log(err);
	  res.status(400).send({
		errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
	  });
	}
  });

router.post("/board/:num",authMiddleware, async (req, res)=>{
	const { num } = req.params;	
	const { comment } = req.body;	
	const {user} = res.locals;
	console.log(num)
	console.log(user)
	// const existBoard = await Board.find({num: Number(num), password: password});	

	// if(existBoard.length){
	// 	await Board.updateOne({num: Number(num)}, { $set: {title, content, name }}) 	
	// }else{
	// 	return res.status(400).json({
	// 		errorMessage: "비밀번호가 다릅니다."	
	// 	});	
	// }
	const commentPost = await Board.findOneAndUpdate({num : Number(num)}, { $push: { comment : {comment : comment, nickname: user.nickname}}})
	 res.json({success: "댓글이 등록되었습니다!"})
})

module.exports = router;