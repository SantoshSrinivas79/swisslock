var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}))
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views')
app.get('/', function(req, res) {
	res.render('index.html');
})

app.listen(3000)
console.log("hello")