var Yelp = require('yelp');
var Twit = require('twitter');
var async = require('async');
var request = require('request');

/*exports.twitterData = function(req, res) {
  var T = new Twit({
      consumer_key: 'W9thjZ87O4uYdrCTUaeLYgMkL',
      consumer_secret: '8xjNnt7I10cs1I4rC7RtBPOzdLwiDlaureBeUQWkCymxVIklBw',
      access_token: '8647102-RzeYwspGy1od5YgxkQrD9lW2p4D4ykrN209qyZKKWX',
      access_token_secret: 'Yisl3ooYrIOngkUB5G4dR7sleTgYqE59xjja9UOvpawCq'
  });
  //
  //  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
  //
  T.get('search/tweets', { q: 'chinese food', geocode: '40.7127,-74.0059,200mi', count: 100 }, function(err, data, response) {
    console.log(response.statusCode)
    if(err) {
      console.dir(err)
      return res.end(err.toString());
    }
    var tweetList = [];
    var count = data.statuses.length;
    async.each(data.statuses, function(item, callback) {
      tweetList.push(item.text)
      console.log(item.text)
      console.log(count)
      if(count == 1) {
        callback();
        return res.render("dashboard",{
          data : tweetList
        });
      }
      count--;
    })
  })
}*/

var Quandl = require("quandl");
  var quandl = new Quandl();

  

exports.yelpRating = function(req, res) {
  var yelp = new Yelp({
    consumer_key: 'R1l4ZxvC1DCgdaU1xfbL3w',
    consumer_secret: 'mF7NQ2zlcA6TQsenRWVh6DGAHnE',
    token: 'fjQiRFcbiAkKGNE-kU7WUx5iTUVkfr6i',
    token_secret: 'BYfr-MjXC8giSi1n8ppZnwVelBI'
  });
  console.log(req.body)
  var location = req.body.location;
  var domain = req.body.domain;
  var query = { term: 'Restaurants, ' + domain + ', All', location: location };
  console.log(query)

  async.parallel({
    competition: function(callback) {
      yelp.search(query)
      .then(function (data) {
        var score, ratings=0, reviews=0, competition, weighted_rating=0, rating_average, weighted_rating_average, competitors;
        competitors = [];
        for(var i = 0; i < data.businesses.length; i++) {
          /*console.log(data.businesses[i].name);
          console.log(data.businesses[i].rating);
          console.log(data.businesses[i].review_count);*/
          competitors.push({name: data.businesses[i].name, rating: data.businesses[i].rating})
          ratings += data.businesses[i].rating;
          reviews += data.businesses[i].review_count;
          weighted_rating += data.businesses[i].rating * data.businesses[i].review_count;
        }
        /*console.log("total ratings ", ratings)
        console.log("total reviews ", reviews)*/
        console.log("total restaurants ", data.businesses.length)
        rating_average = (ratings/data.businesses.length)
        console.log(rating_average)
        weighted_rating_average = weighted_rating/reviews;
        console.log(weighted_rating_average)
        competition = rating_average + weighted_rating_average;
        console.log(competition)
        var competitionObj = {
          competition: competition,
          competitors: competitors
        }
        console.log(competitionObj)
        callback(null, competitionObj)
      })
      .catch(function (err) {
        console.error(err);
        return res.end(err);
      });
    },
    cost: function(callback) {
      // Check if the location is San Jose. Hard coding in interest of time
          var options = {
          auth_token: "kx85nnyejvDJCgxPL3eJ"
      }

      quandl.configure(options);

      var location = req.body.location;
      console.log(location);
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
            return callback(null, "1");
          }
          else if (priceScore > 120) {
            return callback(null, "2");
          }
          else if (priceScore > 110) {
            return callback(null, "3");
          }
          else if (priceScore > 90 && priceScore <= 110) {
            return callback(null, "4");
          }
          else if (priceScore <= 90) {
            return callback(null, "5");
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
            return callback(null, "1");
          }
          else if (priceScore > 120) {
            return callback(null, "2");
          }
          else if (priceScore > 110) {
            return callback(null, "3");
          }
          else if (priceScore > 90 && priceScore <= 110) {
            return callback(null, "4");
          }
          else if (priceScore <= 90) {
            return callback(null, "5");
          }
        });
      }
    }
  }, function(err, results) {
      if(err) res.end(err);
      res.render("dashboard", {
        competitionObj: results.competition,
        cost: results.cost,
        total_score: (results.competition + parseFloat(results.cost))/2
      })
  })
}