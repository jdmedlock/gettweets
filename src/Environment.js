const dotenv = require('dotenv')
const FileOps = require('./FileOps')

class Environment {
  constructor() {
    this.operationalVars = {}
  }

  logEnvVars() {
    console.log('\nEnvironment Variables:')
    console.log('---------------------')
    console.log('- DEBUG: ', process.env.DEBUG)
    console.log('- SCREEN_NAME: ', process.env.SCREEN_NAME)
    console.log('- TWITTER_BEARER_TOKEN: ', process.env.TWITTER_BEARER_TOKEN)
    console.log('- FILE_PATH: ', process.env.FILE_PATH)
    return true
  }

  initDotEnv(path) {
    try {
      const pathToEnv = path ? path : `${ __dirname }`
      if (FileOps.validateDirPath(pathToEnv) !== 0) {
        throw new Error(`.env file not found in path - ${ pathToEnv }`)
      }
      const result = dotenv.config( { path: `${ pathToEnv }/.env`, silent: true } )
      if (result.error) {
        throw result.error
      }
    }
    catch (err) {
      throw err
    }
  }

  isDebug() {
    return this.operationalVars.DEBUG
  }

  getOperationalVars() {
    return this.operationalVars
  }

  setOperationalVars(options) {
    // Retrieve the current variable values from `.env` file
    let { DEBUG, SCREEN_NAME, TWITTER_BEARER_TOKEN, FILE_PATH } = process.env

    // Initialize `operationalVars` allowing command line parameter values
    // to override `.env` parameters
    const debugValue = options.debug ? options.debug : DEBUG
    this.operationalVars.DEBUG = debugValue.toUpperCase() === 'YES' ? true : false
    this.operationalVars.SCREEN_NAME = options.screenName ? options.screenName : SCREEN_NAME
    this.operationalVars.TWITTER_BEARER_TOKEN = TWITTER_BEARER_TOKEN
    this.operationalVars.FILE_PATH = options.filepath ? options.filepath : FILE_PATH
  }
}

module.exports = Environment