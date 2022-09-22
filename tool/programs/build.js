const yargs = require('yargs')

const buildBlogs = require('../controllers/buildBlogs')
const buildMessenger = require('../controllers/buildMessenger')
const buildWallet = require('../controllers/buildWallet')
const { AppModuleTypes, detectAppModule} = require('../appModules')

async function main() {
    const argv = process.argv
    if (argv.length === 2) {
        await buildMessenger()
        await buildWallet()
        await buildBlogs()
        console.log('-- Everything is built.')
    } else {
        const appm = detectAppModule(argv[2])
        if (appm === AppModuleTypes.messenger) {
            await buildMessenger()
        } else if (appm === AppModuleTypes.wallet) {
            await buildWallet()
        } else if (appm === AppModuleTypes.blogs) {
            await buildBlogs()
        } else {
            console.error('Do not know what is ' + argv[2])
        }
    }
}

module.exports = main
