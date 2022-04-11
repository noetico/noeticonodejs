var express = require('express');
var path = require('path');
var sqlitedb = require('./sqlitedb.js');
//var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var session = require('express-session');
var expressValidator = require('express-validator');
var cors = require('cors');
var corp = require('./corporate.js');
var router = express.Router();
const { body, validationResult } = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var passport = require('passport');
var axios = require('axios');
var flash = require('connect-flash');
//var mongo = require('mongodb');
// var mongoose = require('mongoose');
// var db = mongoose.connection;
// var usrmodel = require('./users');
var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(cors());
app.use('/i', corp);


var uploads = multer({
	dest: './uploads'
  });

app.use(require('connect-flash')());
app.use(function(req, res, next){
	res.locals.messages = require('express-messages')(req, res);
	next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// var routes = require('./routes/index');
// var users = require('./routes/users');
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});
//app.listen(process.env.port, '0.0.0.0' || 5000);
//console.log("Express Server running at port 3000");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    res.render('index');

});
app.get('/about', function(req, res){
	res.render('about');
});
app.get('/solutions', function(req, res){
	res.render('solutions');
});
app.get('/contact', function(req, res){
	res.render('contact');
});
app.get('/enterprise', function(req, res){
	res.render('enterprise');
});
app.get('/projects', function(req, res){
	res.render('projects');
});

app.get('/team', function(req, res){
	res.render('team');
});

app.get('/register', function(req, res){
	res.render('register');
});
app.get('/login', function(req, res){
	res.render('login');
});

app.get('/events', function(req, res){
	res.render('events');
});

app.get('/buytokens', function(req, res){
	res.render('buytokens');
});

//POST TEMPLATE WITH MULTER OFF
// app.post('/login', multer().none(),
// body('username', 'Empty email').trim().isLength({ min: 1 }).escape(),
// body('password', 'Password required').trim().isLength({ min: 5 }).escape(),
// (req, res) => {
// });

app.post('/login', multer().none(),
body('username', 'Empty email').trim().isLength({ min: 1 }).escape(),
body('password', 'Password required').trim().isLength({ min: 5 }).escape(),
 (req, res) => {

	const authurl = "https://wendy.solutions/token";
	const errors = validationResult(req);
	
		if (!errors.isEmpty()) {
			console.log(errors);
			res.render('login', {msges : "Validation failed, all fields required, please fill all field."});
		
			//return res.status(400).json({ errors: errors.array() });
			}
			else{
				var postData = JSON.parse(JSON.stringify(req.body));
				//var tokenCode = null;
				
				let response = axios({
					method: 'POST',
					
					url: authurl, 
					proxy: undefined,
					data: postData, 
					headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
					headers:{'Accept': 'application/json; charset=utf-8'},
					
				}).then((res) =>{
					sqlitedb.run('INSERT INTO tokenkeys(tokenkey, date, days) VALUES(?, ?, ?)', [response.data.access_token, new Date(), response.data.expires_in ], (err) => {
						if(err) {
							return console.log(err.message); 
							res.render('login', {msges : "An error occured"});
		
						}
						console.log('Row was added to the table: ${this.lastID}');
					});

					res.render('login', {msges : "Authentication done, token added"});
		
		
				  }).catch((error) => {
					console.error(error);
					res.render('login', {msges : "Validation failed, all fields required, please fill all field."});
		
				  })

			}



}

);
app.post('/register', multer().none(),
	
	  body('name', 'Empty name').trim().isLength({ min: 1 }).escape(),
	  body('email', 'Empty email').trim().isLength({ min: 1 }).escape(),
	  body('password', 'Password required').trim().isLength({ min: 5 }).escape(),
	 // body('password2', 'Password confirm must macth passowrd').trim().isLength({ min: 5 }).escape(),
	 (req, res) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
	
		if (!errors.isEmpty()) {
			console.log(errors);
			res.render('register', {msges : "Validation failed, all fields required, please fill all field."});
		//	swal("App", "Validation Failed", "error");
			//return res.status(400).json({ errors: errors.array() });
			}
			else{
		

		  var postData = JSON.parse(JSON.stringify(req.body));
		//  headers:{'Authorization': 'Bearer ' + authresponse.data.access_token }
		//headers:{'Authorization': 'Bearer ' + tokenCode }
		const url = "https://wendy.solutions/api/account/register";
		const authurl = "https://wendy.solutions/token";
	  
	  let response =  axios({
		  method: 'POST',
		  
		  url: url, 
		  proxy: undefined,
		  data: postData, 
		  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
		  headers:{'Accept': 'application/json; charset=utf-8'}
	  }) 
		.then((res) => {
		  console.log(`statusCode: ${res.status}`)
		  console.log(res)

		  let authresponse =  axios({
			method: 'POST',
			proxy: undefined,
			url: authurl, 
			data: postData, 
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
			headers:{'Accept': 'application/json; charset=utf-8'}
	  


		  }).then((res) =>{
			sqlitedb.run('INSERT INTO tokenkeys(tokenkey, date, days) VALUES(?, ?, ?)', [authresponse.data.access_token, new Date(), authresponse.data.expires_in ], (err) => {
				if(err) {
					return console.log(err.message); 
				}
				console.log('Row was added to the table: ${this.lastID}');
				res.render('register', {msges : "Registration done, Authentication key added"});
		
			})


		  }).catch((error) => {
			console.error(error);
			res.render('register', {msges : "Validation failed, all fields required, please fill all field."});
		

		  })
		  


		})
		.catch((error) => {
		  console.error(error)
		})
		
	}
}
	


				

	);

	
app.post('/contact/send', function(req, res){
	transporter = nodemailer.createTransport({
		service: 'gmail',
			auth: {
				user: 'kent@noetico.com',
				pass: 'Chidi@#0382'
				
				
			}
			
		
	});

	
	
	var mailOpts = {
		
		from: req.body.name,
		to: 'kent@noetico.com',
		subject: req.body.subject,
		text: 'Web Inquiry Mail from'+ req.body.name + 'Message: ' + req.body.message,
		html: '<p></p>'
	}
	transporter.sendMail(mailOpts, function(error, info){
		if(error){
			console.log(error.message);
			res.redirect('/');
		}else{
			
			console.log('Mail Sent');
			res.redirect('/')
		}
		
		
		
	});
});


