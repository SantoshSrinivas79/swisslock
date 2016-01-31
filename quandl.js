exports.getPriceScore = function (req, res) {
	var async = require("async");
	var Quandl = require("quandl");
	var quandl = new Quandl();


	var options = {
	    auth_token: "kx85nnyejvDJCgxPL3eJ"
	}

	quandl.configure(options);

	var location = req.query.location;
	console.log(location);


	// Check if the location is San Jose. Hard coding in interest of time
	var result = location.match(/jose/i);
	// result == 'BEST';

	if (result){
	    console.log('Matched San Jose');
		async.parallel({
		    city: function(callback) {

				// https://www.quandl.com/data/FRED/CUUSA422SA0-Consumer-Price-Index-for-All-Urban-Consumers-All-items-in-San-Francisco-Oakland-San-Jose-CA-CMSA
				// Quandl("FRED/CUUSA422SA0")

				var price_index_san_jose = quandl.dataset({ source: "FRED", table: "CUUSA422SA0" }, function(err, response){
				    if(err)
				        throw err;
				    callback(null, JSON.parse(response).dataset.data[0][1]);
				});
		    },
		    all: function(callback) {
				// https://www.quandl.com/data/FRED/CPIAUCSL-Consumer-Price-Index-for-All-Urban-Consumers-All-Items-USA-Inflation
				// Quandl("FRED/CPIAUCSL")
				var price_index_all_us = quandl.dataset({ source: "FRED", table: "CPIAUCSL" }, function(err, response){
				    if(err)
				        throw err;
				    callback(null, JSON.parse(response).dataset.data[0][1]);
				});
		    }
		}, function(err, results) {
		    // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
		    console.log("The results are");
		    console.log(results);

		    var priceScore = 100*(results.city / results.all);
			console.log("The price score is: " + priceScore);

			if(priceScore > 130){
				return res.end("1");
			}
			else if (priceScore > 120) {
				return res.end("2");
			}
			else if (priceScore > 110) {
				return res.end("3");
			}
			else if (priceScore > 90 && priceScore <= 110) {
				return res.end("4");
			}
			else if (priceScore <= 90) {
				return res.end("5");
			}
		});
	}

	// Check if the location is San Diego. Hard coding in interest of time
	var result = location.match(/diego/i);

	if (result){
	    console.log('Matched San Diego');
		async.parallel({
		    city: function(callback) {
				// https://www.quandl.com/data/FRED/CUUSA424SA0S-Consumer-Price-Index-for-All-Urban-Consumers-All-items-in-San-Diego-CA-MSA
				// Quandl("FRED/CUUSA424SA0S")

				var price_index_san_jose = quandl.dataset({ source: "FRED", table: "CUUSA424SA0S" }, function(err, response){
				    if(err)
				        throw err;
				    callback(null, JSON.parse(response).dataset.data[0][1]);
				});
		    },
		    all: function(callback) {
				// https://www.quandl.com/data/FRED/CPIAUCSL-Consumer-Price-Index-for-All-Urban-Consumers-All-Items-USA-Inflation
				// Quandl("FRED/CPIAUCSL")
				var price_index_all_us = quandl.dataset({ source: "FRED", table: "CPIAUCSL" }, function(err, response){
				    if(err)
				        throw err;
				    callback(null, JSON.parse(response).dataset.data[0][1]);
				});
		    }
		}, function(err, results) {
		    // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
		    console.log("The results are");
		    console.log(results);

		    var priceScore = 100*(results.city / results.all);
			console.log("The price score is: " + priceScore);

			if(priceScore > 130){
				return res.end("1");
			}
			else if (priceScore > 120) {
				return res.end("2");
			}
			else if (priceScore > 110) {
				return res.end("3");
			}
			else if (priceScore > 90 && priceScore <= 110) {
				return res.end("4");
			}
			else if (priceScore <= 90) {
				return res.end("5");
			}
		});
	}
}

