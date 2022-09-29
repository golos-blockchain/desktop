const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareMessenger = require('./prepareMessenger')
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

async function devMessenger(onStarted = () => {}, port = 4020) {
    const repo = 'ui-messenger'
    if (!fs.existsSync(repo)) {
        let branch = await getBranch()
        await prepareMessenger(branch)
    }

    console.log('-- RUNNING LIVE ', repo)

    execEx('npx', ['yarn', 'run', 'dev:desktop'], {
        cwd: repo,
        shell: true,
        env: {
            ...process.env,
            'PORT': port
        },
        color: 'yellowBright',
        logTag: '[' + repo + ']:',
        onOutput: (data, colorize) => {
            const str = data.toString()
            if (str.includes('Compiled successfully')) {
                if (onStarted) {
                    setTimeout(() => onStarted(), 100)
                }
                return colorize(str, 'greenBright')
            }
            return null
        }
    })
}

module.exports = devMessenger
