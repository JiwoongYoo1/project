const express = require('express');
const Board = require('../schemas/board')
const router = express.Router();

router.get('/', (req, res) => {
	res.send('this is root page');
});

router.get('/board', async (req, res) => {
	const {num} = req.query;	

	const board = await Board.find({num});
	res.json({
		board
	});
});

router.get("/board/:num", async (req, res) => {
	const { num } = req.params;
	console.log(num)

	const [board] = await Board.find({ num: Number(num) });

	res.json({
		board,  //goods: detail 같은의미
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

	res.json({success: true});
});

router.put("/board/:num", async (req, res)=>{
	const { num } = req.params;	
	const { title } = req.body;
	const { content } = req.body;
	const { password } = req.body;

	const existBoard = await Board.find({num: Number(num), password: password});	

	if(existBoard.length){
		await Board.updateOne({num: Number(num)}, { $set: {title, content }}) 	
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."	
		});	
	}
	
	 res.json({success: true})
})



router.post("/board", async (req, res) => {
	var today = new Date();
	var date = today.toLocaleString()		
	
	const { title, name, password, content } = req.body;	
	console.log({ title, name, password, content })

	var num = 0
	const Post_ls = await Board.find();	
	num = Post_ls.length + 1
	

	const createdBoard = await Board.create({ title, name, password, content, num, date });

	res.json({ board : "등록 완료!!" });
});

module.exports = router;