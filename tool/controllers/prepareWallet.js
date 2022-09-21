const fs = require('fs')
const rl = require('readline')

const { gitClone } = require('../gitUtils')
const execEx = require('../execEx')

async function prepareWallet(toolBranch, overwrite = false) {
    console.log('-- PREPARING ui-wallet')

    let branch = toolBranch
    if (!branch) {
        branch = rl.question('Cannot detect branch. Which Wallet branch do you need? Example: master ')
    }

    const account = 'golos-blockchain'
    const repo = 'ui-wallet'

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
        const res = await gitClone(account, repo, branch)
    }

    console.log('--- Installing dependencies to build Wallet...')
    await execEx('npx', ['yarn', 'install'], {
        cwd: repo
    })

    console.log('--- Wallet is ready to build.')
}

module.exports = prepareWallet
