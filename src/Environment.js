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
    console.log('- START_DATE: ', process.env.START_DATE)
    console.log('- END_DATE: ', process.env.END_DATE)
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

    console.log('setOperationalVars - options: ', options)

    // Retrieve the current variable values from `.env` file
    let { DEBUG, SCREEN_NAME, TWITTER_BEARER_TOKEN, FILE_PATH, START_DATE, END_DATE } = process.env

    // Initialize `operationalVars` allowing command line parameter values
    // to override `.env` parameters
    const debugValue = options.debug ? options.debug : DEBUG
    this.operationalVars.DEBUG = debugValue.toUpperCase() === 'YES' ? true : false
    this.operationalVars.SCREEN_NAME = options.user !== undefined ? options.user : SCREEN_NAME
    this.operationalVars.TWITTER_BEARER_TOKEN = TWITTER_BEARER_TOKEN
    this.operationalVars.FILE_PATH = options.output !== undefined ? options.output : FILE_PATH
    this.operationalVars.START_DATE = options.startdt !== undefined ? options.startdt : START_DATE
    this.operationalVars.END_DATE = options.enddt !== undefined ? options.enddt : END_DATE
  }
}

module.exports = Environment