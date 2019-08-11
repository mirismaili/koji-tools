const {execSync} = require('child_process')
const {_YLW, RED, RST} = require('ansi-colors-and-styles')

// Recurse through all directories to find koji dotfiles
module.exports = directory => {
	try {
		return execSync('git ls-files', {cwd: directory}).toString().replace(/\n$/, '').split('\n')
	} catch (error) {
		throw Error(error.message +
				`${_YLW}${RED}Have you installed "git" and added it to the "PATH"? See: ` +
				`https://git-scm.com/book/en/v2/Getting-Started-Installing-Git\n${RST}`
		)
	}
}
