// BASE SETUP
// ======================================

// CALL THE PACKAGES --------path------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var mongoose = require('mongoose');
var path = require('path');

var Course = require('./app/course');

//Connect to database
mongoose.connect('mongodb://localhost:27017/OnlineUniversityDB');

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(express.static(__dirname + '/public'));

// get an instance of the express router
var apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.route('/course')
	.get(function(req,res){
		Course.find(function(err,courses){
			if (err) return res.send(err);
			res.json(courses);
		});
	})

	.post(function(req,res){
		var course = new Course();

		course.name = req.body.name;
		course.category = req.body.category;
		course.dateCreated = req.body.dateCreated;
		course.description = req.body.description;

		course.save(function(err){
			if(err){
				if(err.code == 11000)
					return res.json({ success: false, message: 'duplicate entry'});
				else
				{
					errCode = err.code;
					return res.json({ success: false, message: 'err: ' + errCode});
				}
			}
				res.json({ message: 'Course created!'})
		});
	});

apiRouter.route('/course/:course_id')
	.get(function(req,res){
		Course.findById(req.params.course_id, function(err, course){
			if (err) return res.send(err);
			res.json(course);
		});
	})

	.delete(function(req,res){
		Course.remove({_id: req.params.course_id}, function(err,course){
			if (err) return res.send(err);
			res.json({message: "Successfully deleted the course."});
		});
	})

	.put(function(req,res){
		Course.findById(req.params.course_id, function(err,course){
			if (err) return res.send(err);

			//Update info only if new
			if (req.body.name) course.name = req.body.name;
			if (req.body.category) course.category = req.body.category;
			if (req.body.dateCreated) course.dateCreated = req.body.dateCreated;
			if (req.body.description) course.description = req.body.description;

			//save updates
			course.save(function(err) {
				if (err) return res.send(err);

				res.json({message: "Course updated!"});
			});
		});
	});

// basic route for the home page
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/profile.html'));
	});

// START THE SERVER
// ===============================
app.listen(80);
console.log('Application running on 80');