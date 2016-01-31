exports.getSentiment = function (req, res) {
	var request = require("request");
	var async = require("async");

	var location = req.query.location;
	var cuisine = req.query.cuisine;
	console.log(location);
	console.log(cuisine);


	// Check if the location is San Jose. Hard coding in interest of time
	var result = location.match(/jose/i);
	console.log('Matched San Jose');

		async.parallel({
		    positive: function(callback) {
		    	var url = "https://a08d02d8-2432-45b2-a540-b1e982dedcb1:RCFIOmQxdU@cdeservice.mybluemix.net:443/api/v1/messages/count?q="+cuisine+ " food " + location +" AND sentiment:positive";

				request(url, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    var data = JSON.parse(body);
				    console.log(data.search.results);
				    callback(null, data.search.results);
				  }
				});
		    },
		    all: function(callback) {
		    	var url = "https://a08d02d8-2432-45b2-a540-b1e982dedcb1:RCFIOmQxdU@cdeservice.mybluemix.net:443/api/v1/messages/count?q="+cuisine+ " food " + location;

				request(url, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    var data = JSON.parse(body);
				    console.log(data.search.results);
				    callback(null, data.search.results);
				  }
				});
		    }
		}, function(err, results) {
		    // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
		    console.log("The results are");
		    console.log(results);

		    var sentimentScore = (results.positive / results.all)*(5);
			console.log("The sentiment score is: " + Math.round(sentimentScore));
			sentimentScore = Math.round(sentimentScore);
			return res.end(sentimentScore.toString());
		});
}

exports.getTweets = function (req, res) {
	var request = require("request");
	var async = require("async");

	var location = req.query.location;
	var cuisine = req.query.cuisine;
	console.log(location);
	console.log(cuisine);

	async.parallel({
	    tweets: function(callback) {
	    	var url = "https://a08d02d8-2432-45b2-a540-b1e982dedcb1:RCFIOmQxdU@cdeservice.mybluemix.net:443/api/v1/messages/search?q="+cuisine+ " food " + location +" AND sentiment:positive";

			request(url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var data = JSON.parse(body);
			    var tweets = data.tweets;
			    // console.log(tweets);
			    callback(null, tweets);
			  }
			});
	    },
	}, function(err, results) {
	    // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
	    console.log("The results are");
	    console.log(results);

		return res.json(results);
	});
}