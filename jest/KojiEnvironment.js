'use strict'
// noinspection NpmUsedModulesInstalled
const NodeEnvironment = require('jest-environment-node')

/**
 * Include your desired test projects in this array. See the documentation presented for the first instance.
 * Note that you need to INCREASE (or decrease) the timeout parameter (passed to `beforeALl()`) depending on the
 * number and size of test projects (repos). For more information about how cloning the repo, see the documentation
 * presented for `tagName` below.
 */
const allDefinedTestProjects = {
	// Test-project 1: (choose a unique name for it)
	AngularMaterialDynamicThemes: {
		/**
		 * The remote url of the PUBLIC GIT repository of your desired project
		 *
		 * * This entry will only be used in `clone` command. So if the repo has already been cloned (see `localPath`
		 * * documentation) this won't be used.
		 */
		remoteUrl: 'https://github.com/mirismaili/AngularMaterialDynamicThemesScaffold.git',
		
		/**
		 * You should specify where to download (clone) above repository. We chose a directory alongside our project
		 * repository (outside of it; to prevent any conflict with the repository of our own project) and named
		 * it so that future users (that see it) wouldn't be confused.
		 * This local repo will NOT be deleted after finishing tests and remains (caches) there to be used by subsequent
		 * test-runs.
		 */
		localPath: '../koji-tools-test-project-1.tmp',
		
		/**
		 * To prevent variable and unpredictable tests, you may need to specify ONE revision (commit) to test runs against
		 * it. As specifying commit's hash isn't possible in `git clone` command (see
		 * https://stackoverflow.com/questions/3489173/how-to-clone-git-repository-with-specific-revision-changeset) we need
		 * to first tag our desired commit and then pass that tag here.
		 *
		 * * Note that to save time and internet bound, only ONE revision will be downloaded (cloned). See
		 * * https://stackoverflow.com/a/51771769/5318303. This rule also applies to all submodules automatically
		 * * (`--recurse-submodules --shallow-submodules`).
		 *
		 * * This entry will only be used in `clone` command. Not for `rebase`, `reset`, etc.
		 */
		tagName: 'koji-tools-test',
	},
	
	// Test-project 2 (This one isn't a koji project (hasn't ".koji" folder, etc.). So don't use it in the tests that need this feature):
	'AngularMaterialDynamicThemes-library': {
		remoteUrl: 'https://github.com/mirismaili/angular-material-dynamic-themes.git',
		localPath: '../koji-tools-test-project-2.tmp',
		tagName: 'v1.0.4',
	},
	
	// Test-project 3 (This project itself!):
	'this': {
		remoteUrl: "Not needed and won't be used. We know our project always exists under `localPath`! For more " +
				"information, see the documentation above.",
		localPath: ".",
		tagName: "Not needed (like `remoteUrl`). But you should consider the state of this project is VARIABLE during " +
				"the time. So don't use this case in the tests that need fixed state of test-project. For more information, " +
				"see the documentation above.",
	},
}

class KojiEnvironment extends NodeEnvironment {
	constructor(config) {
		super(config)
		this.global.allDefinedTestProjects = allDefinedTestProjects
	}
	
	async setup() {
		await super.setup()
	}
	
	async teardown() {
		await super.teardown()
	}
	
	runScript(script) {
		return super.runScript(script)
	}
}

module.exports = KojiEnvironment
