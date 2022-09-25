const fs = require('fs')
const rl = require('readline-sync')

const execEx = require('../execEx')
const prepareBlogs = require('./prepareBlogs')

async function devBlogs(onStarted = () => {}, port = 4010) {
    const repo = 'ui-blogs'
    // no prepare because it is already exists due to dev tool's flow

    console.log('-- RUNNING LIVE ', repo)

    execEx('npx', ['yarn', 'run', 'dev:app'], {
        cwd: repo,
        shell: true,
        env: {
            ...process.env,
            'PORT': port
        },
        color: 'blueBright',
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

module.exports = devBlogs
