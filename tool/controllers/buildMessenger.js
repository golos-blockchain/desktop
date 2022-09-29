const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareMessenger = require('./prepareMessenger')
const { gitBranches } = require('../gitUtils')

async function buildMessenger() {
    const repo = 'ui-messenger'
    if (!fs.existsSync(repo)) {
        let branch
        try {
            branch = (await gitBranches()).current
        } catch (err) {
        }
        await prepareMessenger(branch)
    }

    console.log('-- BUILDING', repo)

    await execEx('npx', ['yarn', 'run', 'build:desktop'], {
        cwd: repo,
        shell: true
    })

    console.log('--- Messenger is built.')
}

module.exports = buildMessenger
