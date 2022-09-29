const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareWallet = require('./prepareWallet')
const { gitBranches } = require('../gitUtils')

async function buildWallet() {
    const repo = 'ui-wallet'
    if (!fs.existsSync(repo)) {
        let branch
        try {
            branch = (await gitBranches()).current
        } catch (err) {
        }
        await prepareWallet(branch)
    }

    console.log('-- BUILDING', repo)

    await execEx('npx', ['yarn', 'run', 'build:app'], {
        cwd: repo,
        shell: true
    })

    console.log('--- Run utility')

    await execEx('npm', [
        'run',
        'build:app-entry',
        './dist/electron', // these paths are in ui-wallet
        ], {
            cwd: repo,
            shell: true
        })

    console.log('--- Wallet is built.')
}

module.exports = buildWallet
