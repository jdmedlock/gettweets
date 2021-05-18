const { Command } = require('commander')
const program = new Command()

const Environment = require('./src/Environment')
const FileOps = require('./src/FileOps')
const { isDebugOn } = require('./src/Environment')
const getUserId = require('./src/getUserId')
const getUserTweets = require('./src/getUserTweets')

const environment = new Environment()
environment.initDotEnv('./')

const consoleLogOptions = (options) => {
  if (environment.isDebug()) {
    console.log('\getTweets command options:')
    console.log('--------------------')
    console.log('- debug: ',options.debug)
    console.log('- user: ', options.user)
    console.log('- filepath: ', options.filepath)
    console.log('- startdate: ', options.startdate)
    console.log('- enddate: ', options.enddate)
  }
}

program 
  .command('extract')
  .description('Extract tweets from a specified Twitter account')
  .option('-d, --debug <debug>', 'Debug switch to add runtime info to console (YES/NO)')
  .option('-u, --user <screenname>', 'User screen name posting the tweets to be extracted')
  .option('-o, --output <filepath>', 'Path including fully qualified file name the JSON is to be written to')
  .option('-s, --startdt <startdate>', 'Extract Tweets starting from this date')
  .option('-e, --enddt <enddate>', 'Extract Tweets through this date (inclusive)')
  .action( async (options) => {
    environment.setOperationalVars({
      debug: options.debug,
      user: options.user,
      output: options.output,
      startdt: options.startdt,
      emddt: options.enddt,
    })

    environment.isDebug() && console.log('\noperationalVars after setOperationalVars: ', environment.getOperationalVars())

    const { SCREEN_NAME, TWITTER_BEARER_TOKEN, FILE_PATH, START_DATE, END_DATE } = environment.getOperationalVars()
    
    try {
      const twitterUserId = await getUserId(TWITTER_BEARER_TOKEN, SCREEN_NAME)
      const userTweets = await getUserTweets(TWITTER_BEARER_TOKEN, twitterUserId, START_DATE, END_DATE)

      const tweetJSON = '[' + 
        userTweets.reduce((txt, cur, index, array) => {
          const trailingComma = index === (array.length - 1) ? '' : ', '
          return txt + '\n' + JSON.stringify(cur) + trailingComma
        }, '')
        + ']'
      FileOps.writeFileSync(FILE_PATH, tweetJSON, 'utf-8')
    } catch (err) {
      console.log(err)
      process.exit(-1)
    }
    process.exit()
  })

  program.parse(process.argv)