var Twit = require('twitter');
var async = require('async');

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
				return res.json({
					data : tweetList
				});
			}
			count--;
		})
	})
}