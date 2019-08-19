const BASE_URL = 'http://www.dbportal.ic-access.specs-lab.com/api'
const API_KEY = 'dd9451bfd7f887f996e82d88677336abd9c910ab'
const request = require('superagent')

// `http://www.dbportal.ic-access.specs-lab.com/api/items?key=dd9451bfd7f887f996e82d88677336abd9c910ab`

 

async function getItems(filters={}) {
  try {
    var response = await request
    .get(`${BASE_URL}/items`)
    .query({key: API_KEY, ...filters})
  } catch (err) {
    // do something with err...
  }
  return response
}


module.exports.getItems = getItems



