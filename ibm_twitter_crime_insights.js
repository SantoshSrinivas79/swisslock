exports.getCrimeSentiment = function (req, res) {
	var request = require("request");
	var async = require("async");

	var location = req.query.location;
	console.log(location);

	async.parallel({
	    crime: function(callback) {
	    	var url = "https://a08d02d8-2432-45b2-a540-b1e982dedcb1:RCFIOmQxdU@cdeservice.mybluemix.net:443/api/v1/messages/count?q=crime " + location +"";

			request(url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var data = JSON.parse(body);
			    console.log(data.search.results);
			    callback(null, data.search.results);
			  }
			});
	    },
	    all: function(callback) {
		    callback(null, 2500); //Assuming a average of 2500
	    }
	}, function(err, results) {
	    // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
	    console.log("The results are");
	    console.log(results);

	    var sentimentScore = (1 - (results.crime / results.all))*(10);
		console.log("The sentiment score is: " + sentimentScore);
		sentimentScore = sentimentScore;
		return res.end(sentimentScore.toString());
	});
}