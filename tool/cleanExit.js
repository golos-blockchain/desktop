const cleanExit = () => {
    console.log('Shutting child processes down...')
    process.exit()
}

const setCleanExit = () => {
    process.on('SIGINT', () => {
        cleanExit()
    })
    process.on('SIGTERM', () => {
        cleanExit()
    })
}

module.exports = setCleanExit
