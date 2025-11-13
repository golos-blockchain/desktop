const { spawn } = require('child_process')

const execEx = async (command, args, opts) => {
    let chalk
    try { // Because execEx can be rant from autoInstall when no node_modules present
        chalk = require('chalk').default
    } catch (err) {}

    let { logTag, color, onStart, onOutput, ...restOpts } = opts

    const colorize = (arg, customColor) => {
        customColor = customColor || color
        return (color && chalk) ? chalk[customColor](arg) : arg
    }

    const log = (...args) => {
        if (logTag) {
            const colorized = (color && chalk) ? chalk[color](logTag) : logTag
            process.stdout.write(colorized + ' ')
            process.stdout.write(args.join(' '))
            return
        }
        process.stdout.write(args.join(' '))
    }

    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, restOpts)
        if (onStart) {
            onStart(proc)
        }
        proc.stdout.on('data', (data) => {
            if (onOutput) {
                const res = onOutput(data, colorize)
                if (res) {
                    log(res)
                    return
                }
            }
            log(data.toString())
        })
        proc.stderr.on('data', (error) => {
            log(error.toString())
        })
        proc.on('exit', (code) => {
            resolve({ code })
        })
        // TODO: hanging protection if it is not "live"
    })
}

module.exports = execEx
