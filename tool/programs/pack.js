const fs = require('fs')

const buildApp = require('../controllers/buildApp')
const execEx = require('../execEx')

async function main() {
    if (!fs.existsSync('dist/electron/index.html')) {
        await buildApp()
    }

    console.log('-- PACKAGING APP DISTRIBUTIVE')

    await execEx('node', [
        'node_modules/electron-builder/cli.js'])
}

module.exports = main
