(async function() {

const autoInstall = require('./tool/autoInstall')

let main
await autoInstall(() => {
    main = require('./tool/programs/pack')
})

await main()

})()
