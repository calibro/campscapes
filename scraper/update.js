const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')
const program = require('commander')
const api = require('./api')

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


  //getting relations
  console.log(colors.yellow(`Getting relations`))
  const relations = await api.getItemRelations()
  const relationsFilename = path.join(targetDir, 'relations.json')
  fs.writeFileSync(relationsFilename, JSON.stringify(relations))
    
  //getting themes (tags)
  console.log(colors.yellow(`Getting themes`))
  const themes = await api.getTags()
  const themesFilename = path.join(targetDir, 'themes.json')
  fs.writeFileSync(themesFilename, JSON.stringify(themes))

  //getting camps
  console.log(colors.yellow(`Getting camps`))
  const camps = await api.getItemsGreedy({ 
    query: {item_type: 32},
    relations
  })
  const campsFilename = path.join(targetDir, 'camps.json')
  fs.writeFileSync(campsFilename, JSON.stringify(camps))

  //getting icons
  console.log(colors.yellow(`Getting icons`))
  const icons = await api.getItemsGreedy({ 
    query: {item_type: 34},
    //relations
  })
  const iconsFilename = path.join(targetDir, 'icons.json')
  fs.writeFileSync(iconsFilename, JSON.stringify(icons))


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
    something: program.something,
    
  }, console, colors)
} else {
  module.exports = main
}
