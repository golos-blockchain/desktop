const fs = require('fs')
const rl = require('readline-sync')

const { gitClone } = require('../gitUtils')
const execEx = require('../execEx')

async function prepareBlogs(toolBranch, overwrite = false) {
    console.log('-- PREPARING ui-blogs')

    const account = 'golos-blockchain'
    const repo = 'ui-blogs'

    let clone = true
    const exists = fs.existsSync(repo)
    if (exists) {
        if (overwrite) {
            fs.rmSync(repo, { recursive: true, force: true })
        } else {
            clone = false
        }
    }

    if (clone) {
        console.log('--- Downloading ' + repo + ' from GitHub...')

        let branch = toolBranch === 'dev' ? 'beta' : toolBranch

        if (!branch) {
            branch = rl.question('Cannot detect branch. Which Blogs branch do you need? Example: master ')
        }

        const res = await gitClone(account, repo, branch)
    }

    console.log('--- Installing dependencies to build Blogs...')
    await execEx('npx', ['yarn', 'install'], {
        cwd: repo
    })

    console.log('--- Blogs is ready to build.')
}

module.exports = prepareBlogs
