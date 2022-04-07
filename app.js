var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
//var routes = require('./routes/index');
//var users = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000);
console.log("Express Server running at port 3000");

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

app.get('/events', function(req, res){
	res.render('events');
});
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
			console.log('error occured');
			res.redirect('/');
		}else{
			
			console.load('Mail Sent');
			res.redirect('/')
		}
		
		
		
	});
});


