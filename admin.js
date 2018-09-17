var express = require('express');
var app = express();
var swig = require('swig');
var mongoose = require('mongoose');
mongoose.connect('mongodb://spaced:spaced.cc@59.110.20.140:27017/test');
mongoose.Promise = global.Promise;
mongoose.set('debug', false);
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
app.get("/admin",function(req,res){
	Token.find({user: {$exists: true}},function(err,tokens){
		 if(err) return console.err(err);
		 
		 for ( var i = 0; i <tokens.length; i++){
			 let user=tokens[i].user;
			 console.log(tokens[i].token,":",user.username," ",user.mobilePhone," ",user.addressProvince," ",user.addressCity,user.addressDCT,user.addressSR);
		 }
		 return;
	});
});
var server = app.listen(3000, function () {

var host = server.address().address
var port = server.address().port

console.log("应用实例，访问地址为 http://%s:%s", host, port)

})