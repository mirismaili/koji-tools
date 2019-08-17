'use strict'
const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const readDirectory = require('./readDirectory.js')

/**
 * Test-projects for this unit-test should be list here. Choose them from the full list
 * (`KojiEnvironment.allDefinedTestProjects`).
 */
const testProjectsForThisUnit = [
  'AngularMaterialDynamicThemes',
  'AngularMaterialDynamicThemes-library',
  'this',
]
//*************************************************************************************/

// Create a detailed list, based on the above concise list and considering `KojiEnvironment.allDefinedTestProjects`
const testProjects = {}
for (const testProject of testProjectsForThisUnit)
  testProjects[testProject] = global.allDefinedTestProjects[testProject]

// Clone each repository that's not presented locally
beforeAll(async () => {
  const clonePromises = []
  
  for (const testProject of Object.values(testProjects))
      // Has the repository (testProject) already cloned? If not, promise it to be cloned (`cloneGitRepo()`):
    if (!fs.existsSync(testProject.localPath)) clonePromises.push(
        cloneGitRepo(testProject.remoteUrl, testProject.localPath, testProject.tagName)
    )
  
  // Keep all promises together:
  return Promise.all(clonePromises)
}, 15000)

// Run unit-tests per each test-project:
let i = 1
for (const [testProjectName, testProject] of Object.entries(testProjects)) {
  describe(`Test-project ${i++}: "${testProjectName}"`, () => {
    it(`Check the output list`, async () => {
      expect(
          readDirectory(testProject.localPath).map(
              // Make paths relative:
              absPath => path.relative(testProject.localPath, absPath)
          ).sort())
          .toEqual((await readDirectoryRelative(testProject.localPath)).sort())
    }, 10000)
  })
}

/**
 * This is one program that does the job. We compare the result of the current active program (main program) with the
 * result of this program to check the correctness (of both). In case of any inequality, we have to investigate which is
 * incorrect (test or main program). As a probabilistic rule, the problem is with the recently changed (newer) program.
 *
 * @param directory The absolute or relative path of the directory we want to know its contents (files)
 * @returns {Promise<string[]>} The promise of OS-specific relative paths of all git-indexed files in the directory
 * (recursively)
 */
async function readDirectoryRelative(directory) {
  let list = (await exec('git ls-files', {cwd: directory})).stdout.replace(/\n$/, '').split('\n')
  
  // Find the paths of git submodules (not recursive):
  const submodulesInfo = (await exec('git submodule status', {cwd: directory})).stdout
  
  const regExp = /^ [A-Fa-f0-9]{40,64} (.+?) \(.+?\)$/gm   // live: https://regex101.com/r/yUEJNe/2/
  
  while (true) {
    const match = regExp.exec(submodulesInfo)
    
    if (match === null) break
    
    //const submoduleInfo = match[0]
    const submodulePath = match[1]
    
    // Sample values for above variables:
    //     submoduleInfo: " debd72fe632d7315be8e31fe00c7e767c423a01f sub-repo1 (heads/master)"
    //     submodulePath: "sub-repo1"
    
    // Exclude submodule directory from the list:
    list = list.filter(path => path !== submodulePath)
    
    // Instead, add paths under the submodule (recursive):
    list.push(...(await readDirectoryRelative(path.resolve(directory, submodulePath))).map(
        // Make path relative to `directory`:
        nestedPath => path.join(submodulePath, nestedPath))
    )
  }
  
  return list.map(relPath => path.normalize(relPath))
}

// Utilities:

async function cloneGitRepo(testProjectGitUrl, testProjectPath, tagOrBranchName) {
  return new Promise((resolve, reject) => {
    const args = ['clone',
      '--depth=1', `--branch=${tagOrBranchName}`,
      '--recurse-submodules', '--shallow-submodules',
      '--', testProjectGitUrl, testProjectPath
    ]
    
    console.log(`> git ${args.join(' ')}`)
    
    const gitSubProcess = spawn('git', args)
    
    gitSubProcess.on('close', code => {
      const message = `Git sub-process exited with code ${code}`
      if (code !== 0) reject(message)
		 
      console.log(message)
      resolve()
    })
    
    gitSubProcess.on('error', err => console.error(`Failed to start git sub-process! ${err}`))
    
    gitSubProcess.stdout.on('data', data => console.log(data.toString()))
    gitSubProcess.stderr.on('data', data => console.log(data.toString()))
  })
}
