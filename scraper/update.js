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


  //example: getting camps
  const data = await api.getItems({item_type: 32})
  console.log("d", data)


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
