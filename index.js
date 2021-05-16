const { Command } = require('commander')
const program = new Command()

const needle = require('needle')
const Environment = require('./src/Environment')
const { isDebugOn } = require('./src/Environment')
const getUserId = require('./src/getUserId')

const environment = new Environment()
environment.initDotEnv('./')
let isDebug = false

const consoleLogOptions = (options) => {
  if (isDebug) {
    console.log('\getTweets command options:')
    console.log('--------------------')
    console.log('- debug: ',options.debug)
    console.log('- user: ', options.user)
    console.log('- filepath: ', options.filepath)
  }
}

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

const getUserTweets = async (bearerToken, userId) => {
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
          "authorization": `Bearer ${ bearerToken }`
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
  console.log(`Got ${ userTweets.length } Tweets from ${ userName } (user ID ${ userId })!`)

}

program 
  .command('extract')
  .description('Extract tweets from a specified Twitter account')
  .option('-d, --debug <debug>', 'Debug switch to add runtime info to console (YES/NO)')
  .option('-u, --user <screenname>', 'User screen name posting the tweets to be extracted')
  .option('-o, --output <filepath>', 'Path including fully qualified file name the JSON is to be written to')
  .action( async (options) => {
    console.log('options: ', options)
    environment.setOperationalVars({
      debug: options.debug,
      screenName: options.screenname,
      filepath: options.filepath,
    })

    isDebug = environment.isDebug()

    isDebug && consoleLogOptions(options)
    isDebug && console.log('\noperationalVars: ', environment.getOperationalVars())
    environment.isDebug() && environment.logEnvVars()

    const { SCREEN_NAME, TWITTER_BEARER_TOKEN, FILE_PATH } = environment.getOperationalVars()
    
    try {
      const twitterUserId = await getUserId(TWITTER_BEARER_TOKEN, SCREEN_NAME)
      const response = await getUserTweets(TWITTER_BEARER_TOKEN, twitterUserId)
      console.log('tweets: ', response)
    } catch (err) {
      console.log(err)
      process.exit(-1)
    }
    process.exit()
  })

  program.parse(process.argv)