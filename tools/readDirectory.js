'use strict'
const {execSync} = require('child_process')
const {_YLW, RED, RST} = require('ansi-colors-and-styles')
const fs = require('fs')
const path = require('path')

// Get all git-indexed paths
module.exports = directory => {
  if (!fs.statSync(directory).isDirectory()) throw Error(`"${directory}" is not a directory!`)
  
  let outputBuffer
  try {
    outputBuffer = execSync('git ls-files --recurse-submodules', {cwd: directory})
  } catch (err) {
    const error = new Error(err.message +
        `\n${_YLW}${RED}` +   // Red on Yellow bg
        `Have you installed "git" and added it to the "PATH"? If no see: ` +
        `https://git-scm.com/book/en/v2/Getting-Started-Installing-Git\n` +
        `Also, make sure the directory (${directory}) is a git repository.` +
        `${RST}\n`
    )
    error.stack = err.stack
    throw error
  }
  
  return outputBuffer.toString()
      .replace(/\n$/, '')   // remove last empty line
      .split('\n')          // convert String to Array
      .map(relativePath => path.resolve(directory, relativePath))  // convert relative paths to absolute paths and make them OS-specific
}
