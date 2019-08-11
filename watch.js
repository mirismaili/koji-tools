const fs = require('fs')
const path = require('path')
const readDirectory = require('./tools/readDirectory.js')
const findRootDirectory = require('./tools/findRootDirectory.js')
const refresh = require('./refresh.js')

module.exports = () => {
    console.log('koji-tools watching')
    // const props = JSON.parse(refresh())
    // output what the server wants us to in order to start the preview window
    // console.log(props.config.develop.frontend.events.built)
    // NOTE: figure out what to do about this one, because we cant output this before the server is ready...
 
    // make sure that its in there to start, postinstall has been doing so weird stuff
    refresh()
    // watch the .koji directory from a node_modules directory...
    let root = findRootDirectory()
    readDirectory(root, 'node_modules')
    .filter(path => (path.endsWith('koji.json') || path.includes('.koji')) && !path.includes('.koji-resources'))
    .forEach(watchingPath => {
        console.log('watching', path.normalize(watchingPath))
        
        let fsWait = false
        fs.watch(watchingPath, (eventType, filename) => {
            if (fsWait) return
            fsWait = setTimeout(() => fsWait = false, 1000)
            console.log(eventType, filename)
            refresh()
        })
    })
}
