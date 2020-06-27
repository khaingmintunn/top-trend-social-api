const twitter = require("twitter");
const config = require("./config");

const twitter_connection = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret,
});

module.exports.Twitter = twitter_connection;
