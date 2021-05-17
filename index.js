const { Command } = require('commander')
const program = new Command()

const Environment = require('./src/Environment')
const { isDebugOn } = require('./src/Environment')
const FileOps = require('./src/FileOps')
const getUserId = require('./src/getUserId')
const getUserTweets = require('./src/getUserTweets')

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
      const userTweets = await getUserTweets(TWITTER_BEARER_TOKEN, twitterUserId)
      console.log('userTweets[0]: ', userTweets[0])
      const fd = FileOps.openAndClearFile(FILE_PATH)
      await FileOps.objectToFile(FILE_PATH, JSON.stringify(userTweets))
      FileOps.closeFile(fd)
    } catch (err) {
      console.log(err)
      process.exit(-1)
    }
    process.exit()
  })

  program.parse(process.argv)