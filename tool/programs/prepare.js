const yargs = require('yargs')

const prepareBlogs = require('../controllers/prepareBlogs')
const prepareMessenger = require('../controllers/prepareMessenger')
const prepareWallet = require('../controllers/prepareWallet')
const { AppModuleTypes, detectAppModule} = require('../appModules')
const { gitBranches, gitClone } = require('../gitUtils')

async function main() {
    let branch
    try {
        branch = (await gitBranches()).current
    } catch (err) {
    }

    const argv = process.argv
    if (argv.length === 2) {
        await prepareBlogs(branch)
        await prepareMessenger(branch)
        await prepareWallet(branch)
        console.log('-- Everything is ready.')
    } else {
        const appm = detectAppModule(argv[2])
        if (appm === AppModuleTypes.blogs) {
            await prepareBlogs(branch)
        } else if (appm === AppModuleTypes.messenger) {
            await prepareMessenger(branch)
        } else if (appm === AppModuleTypes.wallet) {
            await prepareWallet(branch)
        } else {
            console.error('Do not know what is ' + argv[2])
        }
    }
}

module.exports = main
