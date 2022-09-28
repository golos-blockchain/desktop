(async function() {

const autoInstall = require('./tool/autoInstall')
const setCleanExit = require('./tool/cleanExit')

setCleanExit()

let main
await autoInstall(() => {
    main = require('./tool/programs/build')
})

await main()

})()
