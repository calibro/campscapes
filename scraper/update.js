const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')
const program = require('commander')
const api = require('./api')
const keyBy = require('lodash/keyBy')
const get = require('lodash/get')
const sortBy = require('lodash/sortBy')
const tail = require('lodash/tail')


const CAMPSCAPES_DATA_DIRNAME = 'campscapes-data'


async function main(options){
  console.log("# Campscapes data parser")
  
  console.log("main", options)

  const targetDir = path.resolve(path.join(options.targetDir, CAMPSCAPES_DATA_DIRNAME))

  //creating subdir
  try {
    if (!fs.statSync(targetDir).isDirectory()) {
      console.error(colors.red(`${CAMPSCAPES_DATA_DIRNAME} exists and it's not a directory`))
      process.exit(1)
    } else {
      console.log(colors.yellow(`Target directory "${CAMPSCAPES_DATA_DIRNAME}" existing`))
    }
  } catch (e) {
    console.log(colors.yellow(`Creating target directory "${CAMPSCAPES_DATA_DIRNAME}"`))
    fs.mkdirSync(targetDir)
  }

  //getting all items
  console.log(colors.yellow(`Getting items`))
  let allItems
  const allItemsFilename = path.join(targetDir, 'allItems.json')
  if(!options.downloadItems){
    const allItemsData = fs.readFileSync(allItemsFilename)  
    allItems = JSON.parse(allItemsData)
  } else {
    allItems = await api.getItemsGreedy({ query: {per_page: 50}, greedy: true})
    fs.writeFileSync(allItemsFilename, JSON.stringify(allItems))  
  }

  const allItemsById = keyBy(allItems, 'id')


  //getting all files
  const allFiles = await api.getFiles() 
  const allFilesById = keyBy(allFiles, 'id')

  //getting relations
  console.log(colors.yellow(`Getting relations`))
  const relations = await api.getItemRelations()
  const relationsFilename = path.join(targetDir, 'relations.json')
  fs.writeFileSync(relationsFilename, JSON.stringify(relations))

  //getting camps
  console.log(colors.yellow(`Getting camps`))
  // const camps = await api.getItemsGreedy({ 
  //   query: {item_type: 32},
  //   relations,
  //   allItems,
  // })
  const rawCamps = allItems.filter(item => item.item_type === 'site')
  let camps = await Promise.all(rawCamps.map(async function(camp){
    return await api.enrichWithRelations(camp, relations, allItemsById)
  }))
  const campsFilename = path.join(targetDir, 'camps.json')
  

  //getting themes (tags)
  console.log(colors.yellow(`Getting themes`))
  const themes = await api.getTags()
  const themesFilename = path.join(targetDir, 'themes.json')
  fs.writeFileSync(themesFilename, JSON.stringify(themes))

  //camps network: tbd  
  const campsNetworksFilename = path.join(targetDir, 'campsNetworks.json')
  fs.writeFileSync(campsNetworksFilename, JSON.stringify(camps))

  //getting icons
  console.log(colors.yellow(`Getting icons`))
  const rawIcons = allItems.filter(item => item.item_type === 'icon')
  let icons = await Promise.all(rawIcons.map(async function(icon){
    return await api.enrichWithRelations(icon, relations, allItemsById)
  }))
  const iconsFilename = path.join(targetDir, 'icons.json')
  

  console.log(colors.yellow(`Getting stories`))
  let allPages =  await api.getPages()
  const allExhibits =  await api.getExhibits()
  const allExhibitsById = keyBy(allExhibits, 'id')

  const allPagesWithAttachments = allPages.map(page => api.addPageAttachments(page, allItemsById, allFilesById))
  const allPagesWithAttachmentsById = keyBy(allPagesWithAttachments, 'id')
 
  //fixing items and icons now that we have pages with attachments
  const addRelatedPagesToItem = item => {
    let linkedPages = get(item, 'extended_resources.exhibit_pages')
    linkedPages = Array.isArray(linkedPages) ? linkedPages : [linkedPages]
    item.linkedPages = linkedPages.map(
      linkedPage => {
        const extendedResourceId = get(linkedPage, 'id')
        if(!extendedResourceId){
          return undefined
        }
        const paragraph =  get(allPagesWithAttachmentsById, extendedResourceId)
        if(paragraph && paragraph.exhibit){
          const exhibit = get(allExhibitsById, paragraph.exhibit.id)
          return exhibit && {
            paragraph: paragraph.order,
            exhibitId: exhibit.id,
            exhibitSlug: exhibit.slug,
            exhibitTitle: exhibit.title,
          }  
        }

      }
    ).filter(x => x !== undefined)

    
    return item
    
  }
  allItems = allItems.map(addRelatedPagesToItem)
  fs.writeFileSync(allItemsFilename, JSON.stringify(allItems))  

  icons = icons.map(addRelatedPagesToItem)
  fs.writeFileSync(iconsFilename, JSON.stringify(icons))
  
  camps = camps.map(addRelatedPagesToItem)
  fs.writeFileSync(campsFilename, JSON.stringify(camps))


  const allStories = allExhibits.map(exhibit => {
    // const pages = allPages.filter(page => get(page, 'exhibit.id') === exhibit.id)
    // let pagesWithAttachments = pages.map(page => api.addPageAttachments(page, allItemsById, allFilesById))
    let pagesWithAttachments = allPagesWithAttachments.filter(page => get(page, 'exhibit.id') === exhibit.id)
    pagesWithAttachments = sortBy(pagesWithAttachments, page => page.order)
    // the first page is used for linking a camp to a story (first attachment of first page)
    if(pagesWithAttachments.length > 0){
      if(!exhibit.featured){
        exhibit.camp = get(pagesWithAttachments[0], 'page_blocks[0].attachments[0].item', null)
        exhibit.pages = tail(pagesWithAttachments)
      } else {
        exhibit.pages = pagesWithAttachments
      }
      
    } else {
      exhibit.pages = []
      exhibit.camp = null
    }
    
    const tags = exhibit.credits ? exhibit.credits.split(",") : []
    exhibit.tags = tags.map(tag => tag.trim())
    return exhibit
  })

  const stories = allStories.filter(item => !item.featured)
  const storiesFilename = path.join(targetDir, 'stories.json')
  fs.writeFileSync(storiesFilename, JSON.stringify(stories))

  const featStories = allStories.filter(item => item.featured)
  let introSteps = []
  if(featStories.length){
    const intro = featStories[0]
    introSteps = get(intro, "pages", []).map(page => get(page, 'page_blocks[0].text'))
  }
  const introStepsFilename = path.join(targetDir, 'introSteps.json')
  fs.writeFileSync(introStepsFilename, JSON.stringify(introSteps))


  console.log(colors.yellow(`Getting simple pages`))

  const simplePages =  await api.getSimplePages()
  const simplePagesFilename = path.join(targetDir, 'simplePages.json')
  fs.writeFileSync(simplePagesFilename, JSON.stringify(simplePages))


  // //getting hyperlinks
  // console.log(colors.yellow(`Getting hyperlinks`))
  // const hyperlinks = await api.getItemsGreedy({ 
  //   query: {item_type: 11},
  //   relations
  // })
  // const hyperlinksFilename = path.join(targetDir, 'hyperlinks.json')
  // fs.writeFileSync(hyperlinksFilename, JSON.stringify(hyperlinks))

  // //getting resources
  // console.log(colors.yellow(`Getting resourcess`))
  // const resources = await api.getItemsGreedy({ 
  //   query: {item_type: 33},
  //   relations
  // })
  // const resourcesFilename = path.join(targetDir, 'resources.json')
  // fs.writeFileSync(resourcesFilename, JSON.stringify(resources))

  // //getting references
  // console.log(colors.yellow(`Getting references`))
  // const references = await api.getItemsGreedy({ 
  //   query: {item_type: 33},
  //   relations
  // })
  // const referencesFilename = path.join(targetDir, 'references.json')
  // fs.writeFileSync(referencesFilename, JSON.stringify(references))


}


if (require.main === module) {
  program
    .version('0.1.0')
    .option('-d, --dir <directory>', `Output directory. A subdir "${CAMPSCAPES_DATA_DIRNAME}" will be created if not exisiting`)
    .option('--no-something', 'Skip something')
    .option('--example <dir>', 'Example param.')
    .option('--no-items', 'use existing items')
    .parse(process.argv)

  const inputOption = program.dir || process.argv[2]
 
  let targetDir
  try {
    if (fs.statSync(inputOption).isDirectory()) {
      targetDir = inputOption
    }
  } catch (e) {
    console.error(colors.red('Please specify a valid report directory.'))
    process.exit(1)
  }

  main({
    targetDir,
    downloadItems: program.items,
    something: program.something,
    
  }, console, colors)
} else {
  module.exports = main
}
