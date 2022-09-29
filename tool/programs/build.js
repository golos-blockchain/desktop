const yargs = require('yargs')

const buildBlogs = require('../controllers/buildBlogs')
const buildMessenger = require('../controllers/buildMessenger')
const buildWallet = require('../controllers/buildWallet')
const buildApp = require('../controllers/buildApp')
const { AppModuleTypes, detectAppModule} = require('../appModules')

async function main() {
    const argv = process.argv
    if (argv.length === 2) {
        await buildApp()
        console.log('-- Everything is built.')
    } else {
        const appm = detectAppModule(argv[2])
        if (appm === AppModuleTypes.messenger) {
            await buildMessenger()
        } else if (appm === AppModuleTypes.wallet) {
            await buildWallet()
        } else if (appm === AppModuleTypes.blogs) {
            await buildBlogs()
        } else if (appm === AppModuleTypes.app) {
            await buildApp()
        } else {
            console.error('Do not know what is ' + argv[2])
        }
    }
}

module.exports = main
