const express = require('express');
const Board = require('../schemas/board')
const router = express.Router();

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


router.delete("/board/:num", async(req, res) =>{
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

router.put("/board/:num", async (req, res)=>{
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



router.post("/board", async (req, res) => {
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
	if( !title || !name || !password || !content ){
		return res.status(400).json({
			errorMessage: "빈칸 없이 모두 입력해주세요"	
		});	
	}	
	const createdBoard = await Board.create({ title, name, password, content, num, date });
	
	res.json({ board : "등록 완료!!" });
});

module.exports = router;