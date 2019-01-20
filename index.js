const express = require("express");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dominikuu:A126776091@ds149984.mlab.com:49984/message';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.get('/',(req, res)=>{
	res.sendFile(__dirname + '/index.html')
});
//Get API取得資料
app.get('/comments', (req, res) => {
  db.collection('comments').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.send({data: result})
  })
})
//POST API 創建資料
app.post('/comments', (req, res) =>{
	console.log(req.body);
	db.collection('comments').save(req.body, (err, result) =>{
		if(err) return console.log(err);
		console.log('saved to db');
		res.send(req.body);
	});
})
//DELETE API 刪除資料
const objID = require('mongodb').ObjectID;
app.delete('/comments/:id', (req, res)=>{
	const obj = {_id : ObjectID(req.params.id)};
	db.collection('comments'.remove(obj,function(err, obj){
		if(err) throw err;
		console.log("1 document delete");
		res.send('delete success');
	}))

})
// UPDATE API 更新資料
app.put('comments/:id', (req, res)=>{
	console.log(req.params.id, req.body);
	const newvalues = {$set: req.body};
	const obj = {_id: objID(req.params.id)};
	db.collection("comments").updateOne(obj,newvalues,function(err, obj){
		if(err) throw err;
		console.log("1 document update");
		res.send("update success");
	})
})

app.listen(port, ()=>{});



MongoClient.connect(url, function(err, client){
	if(err) throw err;
	db = client.db("message");
})