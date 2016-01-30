var Yelp = require('yelp');

exports.yelpRating = function(req, res) {
var yelp = new Yelp({
  consumer_key: 'R1l4ZxvC1DCgdaU1xfbL3w',
  consumer_secret: 'mF7NQ2zlcA6TQsenRWVh6DGAHnE',
  token: 'fjQiRFcbiAkKGNE-kU7WUx5iTUVkfr6i',
  token_secret: 'BYfr-MjXC8giSi1n8ppZnwVelBI'
});

var location = 'San Jose';
var cuisine = 'Nachos'
yelp.search({ term: 'Restaurants, ' + cuisine + ', All', location: 'San Jose' })
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
  return res.json({competition: competition})
})
.catch(function (err) {
  console.error(err);
  return res.end(err);
});}