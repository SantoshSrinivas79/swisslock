var Yelp = require('yelp');
var Twit = require('twitter');
var async = require('async');
var request = require('request');

exports.twitterData = function(req, res) {
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
}

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
yelp.search(query)
.then(function (data) {
  var score, ratings=0, reviews=0, competition, weighted_rating=0, rating_average, weighted_rating_average;
  for(var i = 0; i < data.businesses.length; i++) {
    /*console.log(data.businesses[i].name);
    console.log(data.businesses[i].rating);
    console.log(data.businesses[i].review_count);*/
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
  return res.render("dashboard", {competition: competition, total_score : 3.0})
})
.catch(function (err) {
  console.error(err);
  return res.end(err);
});}

exports.alchemyRating = function(req, res) {
  var url = 'https://a08d02d8-2432-45b2-a540-b1e982dedcb1:RCFIOmQxdU@cdeservice.mybluemix.net:443/api/v1/messages/count?q=%28posted:2015-02-01T00:00:00Z,2015-02-15T00:00:00Z AND %23IBM%29"'
  request(url, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage. 
    return res.json(body)
  }
  if(err) return res.end(err.toString())
    console.log(res.statusCode)
})
}