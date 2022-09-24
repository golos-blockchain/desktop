const util = require('node:util')

const execEx = require('./execEx')

const autoInstall = async (requirer) => {
	try {
		requirer()
	} catch (err) {
		console.log('-- INSTALLING dependencies of build system...')
		const { code } = await execEx('npx', ['yarn', 'install'], { shell: true })
		if (code === 0) {
			console.log('-- Dependencies successfully installed.')
			requirer()
		} else {
			process.exit(code)
		}
	}
}

module.exports = autoInstall
