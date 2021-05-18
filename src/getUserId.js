const needle = require('needle')

module.exports = async function getUserId(bearerToken, screenName) {

  const endpointURL = "https://api.twitter.com/2/users/by?usernames="

  // These are the parameters for the API request
  const params = {
    usernames: `${ screenName }`, 
    "user.fields": "id", 
  }

  // this is the HTTP header that adds bearer token authentication
  const res = await needle('get', endpointURL, params, {
    headers: {
      "User-Agent": "v2UserLookupJS",
      "authorization": `Bearer ${ bearerToken }`
    }
  })

  if (res.body) {
    return res.body.data[0].id
  } else {
    throw new Error('Unsuccessful request')
  }
}
