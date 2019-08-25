const BASE_URL = 'http://www.dbportal.ic-access.specs-lab.com/api'
const API_KEY = 'dd9451bfd7f887f996e82d88677336abd9c910ab'
const request = require('superagent')
const queryString = require('query-string');
// `http://www.dbportal.ic-access.specs-lab.com/api/items?key=dd9451bfd7f887f996e82d88677336abd9c910ab`

 

async function getItems(q={}) {
  console.log("q", q)
  try {
    var response = await request
    .get(`${BASE_URL}/items`)
    .query({key: API_KEY, ...q})
  //  
  } catch (err) {
    // do something with err...
  }
  return response
}

async function getItemsRecursive(q={}) {
  let out = []
  const page = q.page || 1

  try {
    const pageData = await getItems(q)
    const lastUrlAndQuery = queryString.parseUrl(pageData.links.last)
    const lastPage = lastUrlAndQuery.query.page
    out = out.concat(pageData.body)

    if(page < lastPage){
      const nextPage = await getItemsRecursive({ ...q, page: page+1})
      out = out.concat(nextPage)
    }

  } catch (err) {
    throw(err)
  }
  
  return out
  
}


module.exports.getItems = getItems
module.exports.getItemsRecursive = getItemsRecursive



