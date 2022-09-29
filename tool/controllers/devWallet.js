const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareWallet = require('./prepareWallet')
const { gitBranches } = require('../gitUtils')

let theBranch

async function getBranch() {
    if (theBranch) return theBranch
    try {
        theBranch = (await gitBranches()).current
        return theBranch
    } catch (err) {
        return ''
    }
}

async function devWallet(onStarted = () => {}, port = 4030) {
    const repo = 'ui-wallet'
    if (!fs.existsSync(repo)) {
        let branch = await getBranch()
        await prepareWallet(branch)
    }

    console.log('-- RUNNING LIVE ', repo)

    execEx('npx', ['yarn', 'run', 'dev:app'], {
        cwd: repo,
        shell: true,
        env: {
            ...process.env,
            'PORT': port
        },
        color: 'magentaBright',
        logTag: '[' + repo + ']:',
        onOutput: (data, colorize) => {
            const str = data.toString()
            if (str.includes('Application started on ')) {
                if (onStarted) {
                    setTimeout(() => onStarted(), 100)
                }
                return colorize(str, 'greenBright')
            }
            return null
        }
    })

}

module.exports = devWallet
