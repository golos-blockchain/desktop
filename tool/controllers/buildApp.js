const fs = require('fs')
const fse = require('fs-extra')
const rl = require('readline-sync')

const execEx = require('../execEx')
const buildBlogs = require('./buildBlogs')
const buildMessenger = require('./buildMessenger')
const buildWallet = require('./buildWallet')

const app_version = require('../../package.json').version

async function copyBuilds(repoBlogs, repoMsgs, repoWallet) {
    console.log('--- Copying Blogs built assets')

    await fse.copy(repoBlogs + '/dist/electron',
        'dist/electron', { overwrite: true })

    const msgsBuild = repoMsgs + '/build'
    const msgsDest = 'dist/electron/msgs'
    console.log('--- Copying ' + msgsBuild + ' to ' + msgsDest)

    await fse.copy(msgsBuild, msgsDest, { overwrite: true })

    const wltBuild = repoWallet + '/dist/electron'
    const wltDest = 'dist/electron/wlt'
    console.log('--- Copying ' + wltBuild + ' to ' + wltDest)
    await fse.copy(wltBuild, wltDest, { overwrite: true })
    fs.copyFileSync(repoBlogs + '/dist/electron/default_cfg.js',
        wltDest + '/default_cfg.js')
}

async function buildApp(dev = false) {
    let repoBlogs = 'ui-blogs'
    let repoMsgs = 'ui-messenger'
    let repoWallet = 'ui-wallet'
    if (!dev) {
        if (!fs.existsSync(repoMsgs + '/build')) {
            await buildMessenger()
        } else {
            console.log('--- Using Messenger which is already built.')
        }

        if (!fs.existsSync(repoWallet + '/dist/electron')) {
            await buildWallet()
        } else {
            console.log('--- Using Wallet which is already built.')
        }

        if (!fs.existsSync(repoBlogs + '/dist/electron')) {
            await buildBlogs()
        } else {
            console.log('--- Using Blogs which is already built.')
        }
    }

    console.log('-- BUILDING ELECTRON APP', dev ? '(DEV)' : '')

    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true })
    }
    fs.mkdirSync('dist/electron', { recursive: true })

    console.log('--- Obtaining wallet, messenger versions')

    let walletConfig = fs.readFileSync(repoWallet + '/package.json')
    walletConfig = JSON.parse(walletConfig)
    const wallet_version = walletConfig.version

    let msgsConfig = fs.readFileSync(repoMsgs + '/package.json')
    msgsConfig = JSON.parse(msgsConfig)
    const msgs_version = msgsConfig.version

    console.log('--- Run blogs utility')

    await execEx('npm', [
        'run',
        'build:app-entry',
        dev ? 'null' : './dist/electron', // these paths are in ui-blogs
        dev ? './default_cfg.js' : './dist/electron/default_cfg.js',
        app_version,
        wallet_version,
        msgs_version], {
            cwd: repoBlogs,
            shell: true
        })

    console.log('--- Adding wallet, messenger versions to config')

    console.log('--- Copying files')

    fs.copyFileSync('tool/electron/app_settings.js', 'dist/electron/app_settings.js')
    fs.copyFileSync('tool/electron/context_menu.js', 'dist/electron/context_menu.js')
    fs.copyFileSync('tool/electron/electron.js', 'dist/electron/electron.js')
    fs.copyFileSync('tool/electron/menu.js', 'dist/electron/menu.js')
    fs.copyFileSync('tool/electron/settings_preload.js', 'dist/electron/settings_preload.js')
    fs.copyFileSync('tool/electron/state_keeper.js', 'dist/electron/state_keeper.js')
    fs.copyFileSync('tool/electron/splash.js', 'dist/electron/splash.js')
    fs.copyFileSync('tool/electron/urls.js', 'dist/electron/urls.js')
    fs.copyFileSync('tool/electron/icons/256x256.png', 'dist/electron/256x256.png')

    if (!dev) {
        await copyBuilds(repoBlogs, repoMsgs, repoWallet)
    } else {
        fs.copyFileSync(repoBlogs + '/default_cfg.js',
            'dist/electron/default_cfg.js')
    }

    console.log('--- Cover is built.')
}

module.exports = buildApp
