const budo = require('budo')
const fs = require('fs')
const path = require('path')

function createProject(opts) {
  // create file from template
  const template = fs.readFileSync('./src/server/template.js', 'utf-8')
  const header = '//this is a generated file, safe to delete it'
  const content = template.replace('<INPUT>', opts.modelFile.replace(/\\/g, '/'))
  const fileName = 'jscad-now.js'
  fs.writeFileSync(fileName, `${header}\n${content}`, 'utf-8')
  return {
    fileName,
    cleanup: () => {
      //delete file
      fs.unlinkSync(fileName)
      process.exit()
    }
  }
}

function createServer(opts) {
  return budo(opts.fileName,
    {
      live: true,
      open: true,
      port: 8099,
      stream: process.stdout,
    }
  ).on('exit', opts.cleanup)
}

function listener(opts) {
  const allCommands = `type "exit" to close server and clean up "${opts.project.fileName}" project file`
  opts.budoInstance.on('connect', () => {
    console.log(allCommands)
  })
  process.stdin.setEncoding('utf-8')
  process.stdin.on('data', data => {
    if (data.trim() === 'exit') {
      opts.budoInstance.close()
    } else {
      console.log(`unknown command\n${allCommands}`)
    }
  })
}

const modelFile = process.argv[2] || './index.js'
let modelFileExists = false

try {
  fs.statSync(path.resolve(modelFile))
  modelFileExists = true
}
catch (e) { }

if (modelFileExists) {

  const project = createProject({ modelFile })

  const budoInstance = createServer(project)

  listener({ project, budoInstance })

} else {
  console.log(`input file "${modelFile}" does not exist`)
  process.exitCode = 1
}