'use strict';

// ==========================
// req the packages we need =
// ==========================
var express		= require('express');
var app 		= express();
var bodyParser	= require('body-parser');
var morgan		= require('morgan');
var path 		= require('path');
var request 	= require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "ONETWOTHREESECRET";

/*not hashed! just for testing*/
var fake_db = [
	{username: "username1", password: "password1"}, 
	{username: "username2", password: "password2"}
];

app.use(express.static(path.join(__dirname, 'static')));

// =======================
// configuration 		 =
// =======================
var port = process.env.PORT || 8080; 

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// ======================
// routes				=
// ======================

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.post('/login', (req,res) => {
	var expires = moment().add(7, 'days').valueOf();
	var token = jwt.encode({
		user: req.body.username,
		exp: expires
	}, secret);

	var username = req.body.username, password = req.body.password;

	console.log(username + " | " + password);

	if (username.length != 0 && password.length != 0) {		

		var loginfail = true;

		for (var i = 0; i < fake_db.length; i++) {

			
			console.log(fake_db[i].username + "==" + username + " ?")

			if(fake_db[i].username == username && fake_db[i].password == password){
				loginfail = false;

				return res.json({
					token: token,
					expires: expires,
					user: username
				});
			}
			else{
				loginfail = true;
			}			
		};	

		if(loginfail){return res.send(401)}
	}
	else{
		return res.send(401);
	}
});

app.post('/protected', (req,res) => {
	var token = req.headers['x-access-token'];
	var user = req.body['user'];

	if (token) {
	  try {
	    var decoded = jwt.decode(token, secret);
	    console.log('decoding: ');
	    console.log(decoded);
	   //2
	    if (decoded.exp <= Date.now()) {
	      res.json(400, {error: 'Login expired!'});
	    }
	    //3
	    let response = {};
	    let senderror = false;

	    for (var i = 0; i < fake_db.length; i++) {

	    	console.log("Found: " + fake_db[i].username + ", want: " + decoded.user);	    	
	    	
	    	if(fake_db[i].username === decoded.user){
	    		response = {message: "success!"};
	    		console.log("success")
	    		res.json(JSON.stringify(response));
	    		senderror = false;
	    		break;
	    	}
	    	else{
	    		response = {message: "bad login!"};
	    		senderror = true;
	    	}	    	    	
	    };	

	    console.log("senderror: " + senderror);	

	    if(senderror){res.json(JSON.stringify(response))}

	  //4
	  } catch (err) {
	    return res.json(JSON.stringify({message: 'Invalid login!'})).status(401);
	  }
	} else {
	  res.json(JSON.stringify({message: 'Invalid login!'})).status(401);
	}
});

// ======================
// start the server		=
// ======================

var server = app.listen(port);

module.exports = server;