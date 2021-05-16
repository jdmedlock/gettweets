const needle = require('needle')
const getUserId = require('./src/getUserId')
require('dotenv').config()

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const bearerToken = process.env.TWITTER_BEARER_TOKEN

const getPage = async (url, params, options, nextToken) => {
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

const getUserTweets = async (userId) => {
  const url = `https://api.twitter.com/2/users/${ userId }/tweets`

  let userTweets = []

  // we request the author_id expansion so that we can print out the user name later
  let params = {
      "max_results": 100,
      'tweet.fields': 'created_at,text,public_metrics,entities',
      "expansions": "author_id"
  }

  const options = {
      headers: {
          "User-Agent": "v2UserTweetsJS",
          "authorization": `Bearer ${bearerToken}`
      }
  }

  let hasNextPage = true
  let nextToken = null
  let userName;
  console.log("Retrieving Tweets...");

  let pageLimit = 5
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

  console.dir(userTweets, {
    depth: null
  });
  console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`)

}

(async () => {
try {
  // Get the users tweets
  const twitterUserId = await getUserId(bearerToken, 'chingucollabs')
  console.log('twitterUserId: ', twitterUserId)
  const response = await getUserTweets(twitterUserId)
  console.log('tweets: ', response)
} catch (e) {
  console.log(e)
  process.exit(-1)
}
process.exit()
})()