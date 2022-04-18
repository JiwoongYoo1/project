const express = require('express');
const Board = require('../schemas/board')
const User = require('../schemas/user')
const Like = require('../schemas/like')
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");


router.get('/', (req, res) => {
	res.send('this is root page');
});

//전체 목록 불러오기 
router.get('/board', async (req, res) => {	

	const board = await Board.find({});
	
	res.json({
		board
	});
});

//전체 목록 불러오기 회원
router.get('/boardtoken',authMiddleware, async (req, res) => {	
	const {nickname} = res.locals.user;	
	const {user} = res.locals;	
	const board = await Board.find({});
	const like = await Like.find({});
	// console.log(like)
	console.log(nickname)
	res.json({
		board, user, like
	});
});

//상세페이지 불러오기 로그인 안 한 경우
router.get("/board/:num", async (req, res) => {
	const { num } = req.params;	
	
	const [board] = await Board.find({ num: Number(num) });
	// console.log(board)
	res.json({
		board
	});
});

//상세페이지 불러오기 로그인 한 경우
router.get("/boardtoken/:num",authMiddleware, async (req, res) => {
	const { num } = req.params;	
	const {user} = res.locals;	

	const [board] = await Board.find({ num: Number(num) });

	res.json({
		board, user  
	});
});

//게시글 삭제
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

//게시글 수정
router.patch("/board/:num",authMiddleware, async (req, res)=>{
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


//게시글 작성
router.post("/board",authMiddleware, async (req, res) => {	
	
	let today = new Date();
	let date = today.toLocaleDateString()
	// console.log(date)
	const {user} = res.locals	

	const { title, password, content } = req.body;	
	let { name } = req.body
	name = user.nickname
	
	let num = 0
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


//회원가입
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
	if(password.length < 4 || password.includes(nickname) ){
		res.status(400).send({
			errorMessage: "비밀번호가 4글자 미만이거나 비밀번호에 닉네임과 같은 값이 포함되어있습니다.  ",
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
		  errorMessage: "중복된 닉네임입니다.",
		});
		return;
	  }

		
	await User.create({ nickname, password });
	
	res.json({ msg : "가입을 축하드립니다!!" });
});


//로그인
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
	//   console.log(token)
	  res.send({
		token, msg:"로그인에 성공하셨습니다"
	  });
	} catch (err) {
		// console.log(err);
	  res.status(400).send({
		errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
	  });
	}
  });


//댓글 등록
router.post("/board/:num",authMiddleware, async (req, res)=>{
	const { num } = req.params;	
	const { comment } = req.body;	
	const {user} = res.locals;
	
	let comment_Num = 0
	const comment_ls = await Board.find({num: Number(num)});
	
	// console.log(comment_Num)	
	if(comment_ls[0]['comment'].length === 0){
		comment_Num = 1
	}else{
		comment_Num = comment_ls[0]['comment'][comment_ls[0]['comment'].length-1]['comment_num']+1 
		// console.log(comment_Num)		
	}


	if(!comment.length){
		res.status(400).send({
			errorMessage: "댓글 내용을 입력해주세요",
		  });
		return;
	}
	
	const commentPost = await Board.findOneAndUpdate({num : Number(num)}, { $push: { comment : {comment : comment, nickname: user.nickname,comment_num: comment_Num  }}})
	 res.json({success: "댓글이 등록되었습니다!"})
})

//댓글 삭제
router.delete("/comment_delete/:num",authMiddleware, async (req, res)=>{
	const { num } = req.params;			
	const { comment_num } = req.body;
	const {user} = res.locals;
	
	// console.log(comment_num)
	
	const existComment = await Board.findOne({num: Number(num)});
	// console.log(existComment)	

	if(existComment){
		await Board.findOneAndUpdate({num : Number(num)}, { $pull: { comment : {comment_num : comment_num}}})		  
	}
	else{
		return res.status(400).json({
			errorMessage: ""			
		});	
	}
	
	res.json({success: "삭제가 완료되었습니다!"});
})

//댓글 수정
router.patch("/comment_update/:num",authMiddleware, async (req, res)=>{
	const { num } = req.params;			
	const { comment_num } = req.body;
	const { comment } = req.body;
	const {user} = res.locals;
	
	// console.log(num)
	// console.log(comment_num)
	// console.log(comment)

	if(!comment){
		return res.status(400).json({
			errorMessage: "빈칸 없이 입력해주세요"	
		});	
	}	
	
	const existComment = await Board.findOne({'num':Number(num)});	
	if(existComment){
		await Board.updateOne({'num':Number(num), "comment.comment_num":comment_num},{$set:{"comment.$":{comment: comment,
		nickname:user.nickname, comment_num:comment_num}}})		  
	}else{
		return res.status(400).json({
			errorMessage: ""			
		});	
	}
	
	res.json({success: "수정이 완료되었습니다!"});
})

//좋아요 등록
router.put("/boardlike",authMiddleware, async (req, res)=>{
	const { num } = req.body;	
	const { user } = res.locals

	const nickname = user.nickname
	const existBoard = await Board.find({num: Number(num)});
	// console.log(existBoard)
	let like = existBoard[0]['like']
	// console.log(like)

	await Board.updateOne({num: Number(num)}, { $set: {like: like + 1 }}) 	
	await Like.create({ nickname, num});

	 res.json({success:""})
})

//좋아요 취소
router.delete("/boardunlike",authMiddleware, async (req, res)=>{
	const { num } = req.body;	
	const { user } = res.locals
	// console.log(user)
		
	const nickname = user.nickname
	const existBoard = await Board.find({num: Number(num)});
	// console.log(existBoard)
	let like = existBoard[0]['like']
	// console.log(like)

	await Board.updateOne({num: Number(num)}, { $set: {like: like - 1 }}) 	
	await Like.findOneAndDelete({ nickname:nickname, num: Number(num)},{nickname});
	
	res.json({success: ""})
})

//게시판 검색 회원
router.get("/boardsearchtoken/:search", authMiddleware, async (req, res)=>{
	const { search } = req.params;
	const { user } = res.locals;		
	const like = await Like.find({});	
	
	// console.log(search)
	// console.log(user)
	// console.log(like)
	
	const searchBoard = await Board.find({name: search});	
	
	 res.json({searchBoard,user,like})
})

//게시판 검색 비회원
router.get("/boardsearch/:search", async (req, res)=>{
	const { search } = req.params;	
	
	console.log(search)
	
	const searchBoard = await Board.find({name: search});	
	
	 res.json({searchBoard})
})




module.exports = router;







//좋아요 등록
router.put("/boardlike",authMiddleware, async (req, res)=>{
	const { post_id } = req.body;	
	const { user } = res.locals
	console.log(post_id)

	const id = user.id
	const existBoard = await Write_modify.find({post_id: Number(post_id)});
	console.log(existBoard)
	let like = existBoard[0]['like']
	console.log(like)

	await Write_modify.updateOne({post_id: Number(post_id)}, { $set: {like: like + 1 }}) 	
	await Like.create({ id, post_id});

	 res.json({success:""})
})

//좋아요 취소
router.put("/boardunlike",authMiddleware, async (req, res)=>{
	const { post_id } = req.body;	
	const { user } = res.locals
	console.log(post_id)
		
	const id = user.id
	const existBoard = await Write_modify.find({num: Number(num)});
	console.log(existBoard)
	let like = existBoard[0]['like']
	console.log(like)

	await Write_modify.updateOne({post_id: Number(post_id)}, { $set: {like: like - 1 }}) 	
	await Like.findOneAndDelete({ id:id, post_id: Number(post_id)},{id});
	
	res.json({success: ""})
})


