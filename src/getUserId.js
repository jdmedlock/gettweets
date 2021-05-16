const needle = require('needle')

module.exports = async function getUserId(bearerToken, screenName) {

  const endpointURL = "https://api.twitter.com/2/users/by?usernames="

  // These are the parameters for the API request
  // specify User names to fetch, and any additional fields that are required
  // by default, only the User ID, name and user name are returned
  const params = {
    usernames: `${ screenName }`, // Edit usernames to look up
    "user.fields": "id", // Edit optional query parameters here
    "expansions": ""
  }

  // this is the HTTP header that adds bearer token authentication
  const res = await needle('get', endpointURL, params, {
    headers: {
      "User-Agent": "v2UserLookupJS",
      "authorization": `Bearer ${ bearerToken }`
    }
  })

  if (res.body) {
    console.log('getUserId - res.body: ', res.body)
    return res.body.data[0].id
  } else {
    throw new Error('Unsuccessful request')
  }
}
