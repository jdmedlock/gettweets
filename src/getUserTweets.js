const needle = require('needle')

module.exports = async function getUserTweets(bearerToken, userId, startDate, endDate) {

  async function getPage(url, params, options, nextToken) {
    if (nextToken) {
      params.pagination_token = nextToken
    }
  
    try {
      const resp = await needle('get', url, params, options)
  
      if (resp.statusCode != 200) {
        console.log(`${ resp.statusCode } ${ resp.statusMessage }:\n${ resp.body }`)
        return
      }
      return resp.body
    } catch (err) {
      throw new Error(`Request failed: ${err}`)
    }
  }

  const url = `https://api.twitter.com/2/users/${ userId }/tweets`

  let userTweets = []

  // we request the author_id expansion so that we can print out the user name later
  let params = {
    "max_results": 100,
    'tweet.fields': 'created_at,text,public_metrics,entities',
    "expansions": "author_id",
    "start_time": startDate !== undefined ? startDate.concat('T00:00:01Z') : '',
    "end_time": endDate !== undefined ? endDate.concat('T23:59:59Z') : '',
  }

  const options = {
    headers: {
      "User-Agent": "v2UserTweetsJS",
      "authorization": `Bearer ${bearerToken}`,
    }
  }

  let hasNextPage = true
  let nextToken = null
  let userName;
  console.log("Retrieving Tweets...");

  let pageLimit = 2
  while (hasNextPage) {
    let resp = await getPage(url, params, options, nextToken)
    pageLimit -= 1
    if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0 && pageLimit > 0) {
      userName = resp.includes.users[0].username
      if (resp.data) {
        userTweets.push.apply(userTweets, resp.data)
      }
      if (resp.meta.next_token) {
        nextToken = resp.meta.next_token
      } else {
        hasNextPage = false
      }
    } else {
      hasNextPage = false
    }
  }

  console.log(`Got ${ userTweets.length } Tweets from ${ userName } (user ID ${ userId })!`)
  return userTweets
}