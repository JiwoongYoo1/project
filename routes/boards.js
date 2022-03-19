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

	const [board] = await Board.find({ num: Number(num) });

	res.json({
		board,  //goods: detail 같은의미
	});
});


router.delete("/board/:num", async(req, res) =>{
	const { num } = req.params;	
	const { password } = req.body;

	const existBoard = await Board.find({num: Number(num)});
	const existPassword = await Board.find({password: password});

	if(existBoard.length && password === existPassword){
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

	const existBoard = await Board.find({num: Number(num)});
	const existPassword = await Board.find({password: password});

	if(existBoard.length && password === existPassword){
		await Board.updateOne({num: Number(num)}, { $set: {title, content }}) 	
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."	
		});	
	}
	
	 res.json({success: true})
});

router.post("/board", async (req, res) => {
	const { title, name, password, content, num, date} = req.body;	

	const createdBoard = await Board.create({ title, name, password, content, num, date });

	res.json({ board: createdBoard });
});

module.exports = router;