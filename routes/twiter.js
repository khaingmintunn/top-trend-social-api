const express = require("express");
const connection = require("../config/connection");
const router = express.Router();

/**
 * to get the trend post by woeid
 * get woeid at https://codebeautify.org/jsonviewer/f83352
 * Myanmar woeid -> 23424763 but, it has not support on it
 * https://twittercommunity.com/t/woeid-for-myanmar-23424763-is-not-work-to-get-trending-topics-for-myanmar-using-twitter-api-what-should-i-do/113032
 */
router.get("/:woeid", async (req, res) => {
  try {
    const params = { ...req.params };
    const trend_names = await getFiveTrendNames(params.woeid);

    const posts = await Promise.all(
      trend_names.map(async (name) => {
        let posts = await getTrendPosts(name);
        return {
          name,
          posts,
        };
      })
    );

    return res.status(200).send({
      posts,
    });
  } catch (error) {
    return res.status(500).send({
      message: "An error during getting trend twitter posts.",
    });
  }
});

/**
 * to get five trend name by woeid
 * @param {String} woeid woeid
 * @returns {Array} trend name array
 */
async function getFiveTrendNames(woeid) {
  const result = await new Promise(async (resolve) => {
    connection.Twitter.get(
      "trends/place",
      {
        id: woeid,
      },
      (error, tweet) => {
        resolve(tweet);
      }
    );
  });

  const five_trends = result[0].trends.slice(0, 5);

  const trand_names = five_trends.map((trend) => {
    return trend.name;
  });

  return trand_names;
}

/**
 * get trend posts' data by name
 * @param {String} name trend name
 */
async function getTrendPosts(name) {
  try {
    const query = {
      q: name,
      result_type: "mixed",
    };

    const result = await new Promise(async (resolve) => {
      connection.Twitter.get("search/tweets", query, (error, tweet) => {
        resolve(tweet);
      });
    });

    let fav_result = await sortByFavoriteCount(result.statuses);

    // slice array length 5 and get top 5 list by favorite_count
    fav_result = fav_result.slice(0, 5);

    const posts = [];
    fav_result.map((result) => {
      const images = [];
      if (result.extended_entities) {
        result.extended_entities.media.map((media) => {
          images.push(media.media_url_https);
        });
      }
      posts.push({
        username: result.user.name,
        profile_image: result.user.profile_image_url_https,
        followers_count: result.user.followers_count,
        text: result.text,
        images,
        fav_count: result.favorite_count,
      });
    });

    return posts;
  } catch (error) {
    console.log(error);
  }
}

/**
 * to sort the trend array by favorite_count
 * @param {Array} arr trend array
 */
async function sortByFavoriteCount(arr) {
  const sorted_result = arr.sort((a, b) => {
    return b.favorite_count - a.favorite_count;
  });

  return sorted_result;
}

module.exports = router;
