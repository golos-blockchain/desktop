const fs = require('fs')
const fse = require('fs-extra')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareBlogs = require('./prepareBlogs')
const buildMessenger = require('./buildMessenger')
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

async function buildBlogs() {
    const repo = 'ui-blogs'
    if (!fs.existsSync(repo)) {
        let branch = await getBranch()
        await prepareBlogs(branch)
    }

    const repoMsgs = 'ui-messenger'
    if (!fs.existsSync(repoMsgs + '/build')) {
        await buildMessenger()
    } else {
        '--- Using Messenger which is already built.'
    }

    console.log('-- BUILDING', repo)

    const msgsBuild = repoMsgs + '/build'
    const msgsDest = repo + '/msgs-build'
    console.log('--- Copying ' + msgsBuild + ' to ' + msgsDest)

    await fse.copy(msgsBuild, msgsDest)

    console.log('--- Starting Blogs build...')

    await execEx('npx', ['yarn', 'run', 'build:app'], {
        cwd: repo
    })

    console.log('--- Blogs is built.')
}

module.exports = buildBlogs
