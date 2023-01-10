

module.exports = function initUrls(appSet) {
    let site_domain = appSet.site_domain
    try {
        site_domain = new URL(site_domain).host
    } catch (error) {}

    const appUrl = 'app://' + site_domain
    const httpsUrl = 'https://' + site_domain

    const isHttpsURL = (url) => {
        return url.startsWith(httpsUrl)
    }
    const isOwnUrl = (url) => {
        return isHttpsURL(url) || url.startsWith(appUrl) || isMsgsUrl(url) || isWalletUrl(url)
    }

    let msgsHost
    try {
        let url = new URL(appSet.messenger_service.host)
        if (url.protocol === 'app:') {
            msgsHost = url.host
        }
    } catch (err) {
        console.error(err)
    }

    const isMsgsUrl = (url) => {
        return msgsHost && (url.startsWith('https:// ' + msgsHost) || url.startsWith('app://' + msgsHost))
    }

    const appMsgsUrl = 'app://' + msgsHost

    let walletHost
    try {
        let url = new URL(appSet.wallet_service.host)
        if (url.protocol === 'app:') {
            walletHost = url.host
        }
    } catch (err) {
        console.error(err)
    }

    const isWalletUrl = (url) => {
        return walletHost && (url.startsWith('https:// ' + walletHost) || url.startsWith('app://' + walletHost))
    }

    const appWalletUrl = 'app://' + walletHost

    return {
        appUrl, httpsUrl, isOwnUrl,
        msgsHost, isMsgsUrl, appMsgsUrl,
        walletHost, isWalletUrl, appWalletUrl
    }
}
