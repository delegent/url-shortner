const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./moels/shortUrl')
const app = express();
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://localhost/urlShortner',{
	useNewUrlParser:true
})



app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));

app.get('/', async function(req,res){
const urls = await ShortUrl.find()
	res.render('index',{urls:urls});
})



app.post('/shortUrl' , async function(req,res){
	   await ShortUrl.create({full:req.body.fullUrl})
	   res.redirect('/');
})

app.get('/:shortUrl', async function(req,res){
	const foundUrl = await ShortUrl.findOne({short : req.params.shortUrl});
	if(!foundUrl){
		return res.sendStatus(404);
	}

	foundUrl.clicks++;
	foundUrl.save();
	res.redirect(foundUrl.full);
})

app.listen(5000,()=>console.log("Server has started"));