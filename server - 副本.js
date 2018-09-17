var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig')
app.use(express.static('public'));
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
//app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');
app.get('/token',function(req,res){
	var token=req.query.token;
	//验证token
	var hastoken=true;
	if(hastoken&&token!=null){
		res.render("index",{
			token:token
		});
	}else{
		res.render("error",{
			error:"非法连接！请重新扫描二维码"
		});
	}
});
app.post('/confirm', urlencodedParser,function(req,res){
	console.log(req.body.province,req.body.city,req.body.district);
	responce = {
		userName:req.body.userName,
		phoneNumber:req.body.phoneNumber,
		province:req.body.province,
		city:req.body.city,
		district:req.body.district,
		address:req.body.address,
		token:req.body.token
	};
	res.render("confirm",{
		userName:responce.userName,
		telephone:responce.phoneNumber,
		province:req.body.province,
		city:req.body.city,
		district:req.body.district,
		address:req.body.address,
		token:responce.token
	});
});
app.post('/process_post', urlencodedParser, function (req, res) {
	// 输出 JSON 格式
	responce = {
		userName:req.body.userName,
		phoneNumber:req.body.phoneNumber,
		city:req.body.city,
		district:req.body.district,
		address:req.body.address,
		token:req.body.token
	};
	//写数据库操作
	var result=true;//读写数据库是否成功
	if(result){
		res.render("finish",{
			hint:"订单已经生成！我们将尽快配送",
			userName:responce.userName,
			telephone:responce.phoneNumber,
			address:responce.address
	});
	}else{
		res.render("error",{
			error:"非法连接！请重新扫描二维码"
		});
	}
});

var server = app.listen(8081, function () {

var host = server.address().address
var port = server.address().port

console.log("应用实例，访问地址为 http://%s:%s", host, port)

})