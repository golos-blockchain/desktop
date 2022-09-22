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

    console.log('--- Wallet is built.')
}

module.exports = buildWallet
