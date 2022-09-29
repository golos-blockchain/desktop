const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareBlogs = require('./prepareBlogs')
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

    console.log('-- BUILDING', repo)

    await execEx('npx', ['yarn', 'run', 'build:app'], {
        cwd: repo,
        shell: true
    })

    console.log('--- Blogs is built.')
}

module.exports = buildBlogs
