const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareBlogs = require('./prepareBlogs')
const { gitBranches } = require('../gitUtils')

async function buildBlogs() {
    const repo = 'ui-blogs'
    if (!fs.existsSync(repo)) {
        let branch
        try {
            branch = (await gitBranches()).current
        } catch (err) {
        }
        await prepareBlogs(branch)
    }

    console.log('-- BUILDING', repo)

    console.log('--- Blogs is built.')
}

module.exports = buildBlogs
