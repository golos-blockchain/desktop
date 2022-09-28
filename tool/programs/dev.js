const fs = require('fs')
const path = require('path')

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

    let triggered = 0

    const startApp = () => {
        execEx('./node_modules/electron/dist/electron', [
            '--no-sandbox', '.'], {
            color: 'cyan',
            logTag: '[app]:',
            env: {
                ...process.env,
                DEV: true
            },
            onStart: proc => {
                const el = path.resolve(__dirname, '../electron')
                const watcher = fs.watch(el, async (eventType, fileName) => {
                    const now = Date.now()
                    if (now - triggered < 3000) return
                    triggered = now
                    console.log('-- Restarting Electron due to changes...')
                    watcher.close()
                    proc.stdin.pause()
                    proc.kill()
                    await buildApp(true)
                    startApp()
                })
            }
        })
    }

    startApp()
}

module.exports = main
