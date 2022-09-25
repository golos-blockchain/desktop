const fs = require('fs')

const prepareBlogs = require('../controllers/prepareBlogs')
const devBlogs = require('../controllers/devBlogs')
const devMessenger = require('../controllers/devMessenger')
const devWallet = require('../controllers/devWallet')
const buildApp = require('../controllers/buildApp')
const execEx = require('../execEx')
const { AppModuleTypes, detectAppModule} = require('../appModules')
const { gitBranches } = require('../gitUtils')

let theBranch

async function getBranch() {
    if (theBranch) return theBranch
    try {
        theBranch = (await gitBranches()).current
        return theBranch
    } catch (err) {
        console.error(err)
        return ''
    }
}

async function main() {
    const repo = 'ui-blogs'
    if (!fs.existsSync(repo)) {
        let branch = await getBranch()
        await prepareBlogs(branch)
    }

    await buildApp(true)

    console.log('-- RUNNING IN DEV MODE')

    await new Promise(async (resolve, reject) => {
        let blogsStarted = false, msgsStarted = false, walletStarted = false

        const checkAllStarted = () => {
            if (blogsStarted && msgsStarted && walletStarted) {
                resolve()
            }
        }

        await devBlogs(() => {
            blogsStarted = true
            checkAllStarted()
        })
        await devWallet(() => {
            msgsStarted = true
            checkAllStarted()
        })
        await devMessenger(() => {
            walletStarted = true
            checkAllStarted()
        })
    })

    console.log('--- Running electron')

    await execEx('./node_modules/electron/dist/electron', [
        '--no-sandbox', '.'], {
        color: 'cyan',
        logTag: '[app]:',
        env: {
            ...process.env,
            DEV: true
        }
    })
}

module.exports = main
