var express = require('express');
var bodyParser = require('body-parser');
var dashboard = require('./dashboard/dashboard.js');
var logger = require('morgan')
var path = require('path')
var quandl = require('./quandl')
var ibmTwitter = require('./ibm_twitter_insights.js')
var ibmTwitterCrime = require('./ibm_twitter_crime_insights.js')
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}))
var rootPath = path.normalize(__dirname)
app.use(express.static(rootPath + '/public'));
app.set('views', rootPath + '/views');
app.set('view engine', 'ejs');
app.use(logger('dev'));

app.post('/dashboard', dashboard.yelpRating);

app.get('/quandl', quandl.getPriceScore);

app.get('/getSentiment', ibmTwitter.getSentiment);
app.get('/getTweets', ibmTwitter.getTweets);
app.get('/getCrimeSentiment', ibmTwitterCrime.getCrimeSentiment);

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/demo', function(req, res) {
	res.render('demo');
});


app.get('*', function(req, res) {
	res.render('index')
})
var port = 3000 || process.env.port
app.listen(port);
console.log("app is listening at " + port)