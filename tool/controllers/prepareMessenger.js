const fs = require('fs')
const rl = require('readline-sync')

const { gitClone } = require('../gitUtils')
const execEx = require('../execEx')

async function prepareMessenger(toolBranch, overwrite = false) {
    console.log('-- PREPARING ui-messenger')

    const account = 'golos-blockchain'
    const repo = 'ui-messenger'

    let clone = true
    const exists = fs.existsSync(repo)
    if (exists) {
        if (overwrite) {
            fs.rmSync(repo, { recursive: true, force: true })
        } else {
            clone = false
        }
    }

    if (clone) {
        console.log('--- Downloading ' + repo + ' from GitHub...')

        let branch = toolBranch
        if (!branch) {
            branch = rl.question('Cannot detect branch. Which Messenger branch do you need? Example: master ')
        }

        const res = await gitClone(account, repo, branch)
    }

    console.log('--- Installing dependencies to build Messenger...')
    await execEx('npx', ['yarn', 'install'], {
        cwd: repo
    })

    console.log('--- Messenger is ready to build.')
}

module.exports = prepareMessenger
