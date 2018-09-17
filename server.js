var express = require('express');
var mongoose = require('mongoose')
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig')
app.use(express.static('public'));
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
mongoose.connect('mongodb://spaced:spaced.cc@59.110.20.140:27017/test');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
const Token = mongoose.model('Token', 
	{
		token : String,
		ordernumber:String,
		user : { 
			username: String,
			mobilePhone: String,
			addressSR : String,
			addressDCT : String,
			addressCity : String,
			addressProvince : String
		}
	}
);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log('we are connected!'); 
    // initialize
});
app.use(bodyParser.json());
app.use(urlencodedParser);
//app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');
app.get('/:token',function(req,res){
	let _token = req.params.token
	if (_token){
		Token.findOne({ token: _token })
			.then(data => {
				if (data) {
					console.log(data.user);
			    	if (data.user!="{}") {
						let user=data.user;
						if(data.ordernumber!=null){
							res.render('finish',{
								hint:"订单号："+data.ordernumber,
								userName:"姓名："+user.username,
								address:"地址："+user.addressProvince+user.addressCity+user.addressDCT+user.addressSR,
								telephone:"电话："+user.mobilePhone
							});
						}else{
							res.render('finish',{
								hint:"订单已经生成！请耐心等待！",
								userName:"姓名："+user.username,
								address:"地址："+user.addressProvince+user.addressCity+user.addressDCT+user.addressSR,
								telephone:"电话："+user.mobilePhone
							});
						}
			    		// return data.ordernumber or null
					} else {
						res.render('index',{
							token:_token
						});
						
					}
				} else {
					res.render("error",{
						error:"兑换券不存在，请检查后再提交！"
					});
			    }
			})
			.catch(err => {
				res.render("error",{
					error:"出错了，请联系客服:01082750720"
				});
			})
	} else {
		res.status(404).end('无效链接！')
	}
});
app.post('/confirm',function(req,res){
	if (!req.body){
		res.render("error",{
			error:"没有提交收货地址和联系人！"
		});
		return
	}
	console.log(req.body.province,req.body.city,req.body.district);
	let responce = {
		userName:req.body.userName.trim(),
		phoneNumber:req.body.phoneNumber.trim(),
		province:req.body.province.trim(),
		city:req.body.city.trim(),
		district:req.body.district.trim(),
		address:req.body.address.trim(),
		token:req.body.token.trim()
	};
	res.render("confirm",{
		userName:responce.userName,
		telephone:responce.phoneNumber,
		province:responce.province,
		city:responce.city,
		district:responce.district,
		address:responce.address,
		token:responce.token
	});
});
app.post('/process_post', urlencodedParser, function (req, res) {
	// 输出 JSON 格式
	if (!req.body){
		res.render("error",{
			error:"没有提交收货地址和联系人！"
		});
		return
	}
	
	let responce = {
		userName:req.body.userName.trim(),
		phoneNumber:req.body.phoneNumber.trim(),
		province:req.body.province.trim(),
		city:req.body.city.trim(),
		district:req.body.district.trim(),
		address:req.body.address.trim(),
		token:req.body.token.trim()
	};
	console.log(responce.token)
	//写数据库操作
	if (responce.userName && responce.phoneNumber) {
		Token.findOne({ token : responce.token }, function(err, data) {
			if (data.user!="{}") {
				res.render("error",{
						error:"已经生成了订单，如果要修改请联系客服:01082750720！"
				});
			} else {
				data.user = {}
			    data.user.username = responce.userName
			    data.user.mobilePhone = responce.phoneNumber
			    data.user.addressSR = responce.address
			    data.user.addressDCT = responce.district
			    data.user.addressCity = responce.city
			    data.user.addressProvince = responce.province
				data.token=responce.token
			    data.save()
			        .then(data => {
			            res.render("finish",{
							hint:"订单已经生成！我们将尽快配送",
							userName:responce.userName,
							telephone:responce.phoneNumber,
							address:responce.address
						})
					})
			        .catch(err => {
			           res.render("error",{
						error:"非法连接！请重新扫描二维码"
						});
			        })
			}
		})
	}
})
var server = app.listen(8081, function () {

var host = server.address().address
var port = server.address().port

console.log("应用实例，访问地址为 http://%s:%s", host, port)

})