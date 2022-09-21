const { spawn } = require('child_process')

const execEx = async (command, args, opts) => {
	return new Promise((resolve, reject) => {
		const proc = spawn(command, args, opts)
		proc.stdout.on('data', (data) => {
			console.log(data.toString())
		})
		proc.stderr.on('data', (error) => {
			console.error(error.toString())
		})
		proc.on('exit', (code) => {
			resolve({ code })
		})
		// TODO: hanging protection
	})
}

module.exports = execEx
