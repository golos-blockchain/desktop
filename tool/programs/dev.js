const fs = require('fs')

const buildApp = require('../controllers/buildApp')
const execEx = require('../execEx')

async function main() {
    if (!fs.existsSync('dist/electron/index.html')) {
        await buildApp()
    }

    console.log('-- RUNNING IN DEV MODE')

    await execEx('./node_modules/electron/dist/electron', [
        '--no-sandbox', '.'])
}

module.exports = main
