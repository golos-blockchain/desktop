
const AppModuleTypes = {
    blogs: 1,
    wallet: 2,
    messenger: 3
}

const detectAppModule = (arg) => {
    switch (arg) {
        case 'blogs':
            return AppModuleTypes.blogs
        break
        case 'wallet':
            return AppModuleTypes.wallet
        break
        case 'msgr':
        case 'messenger':
        case 'msgs':
        case 'messages':
        case 'messager':
        case 'mssgs':
        case 'mssgr':
        case 'chat':
        break
        default:
            return
    }
}

module.exports = {
    AppModuleTypes,
    detectAppModule
}
