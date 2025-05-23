const { BrowserWindow, shell, Menu, ipcMain, dialog } = require('electron')

const { createContextMenu } = require('./context_menu')

function initMenu(appUrl, httpsUrl, appSet, full = true) {
    let template = [
        {
            label: 'Обновить',
            role: 'forceReload'
        },
        {
            label: 'Настройки',
            submenu: [
                {
                    label: 'Увеличить масштаб',
                    role: 'zoomin',
                    accelerator: 'CommandOrControl+='
                },
                {
                    label: 'Уменьшить масштаб',
                    role: 'zoomout',
                },
            ]
        },
        {
            role: 'help',
            label: 'Помощь',
            submenu: [
                {
                    label: 'Все посты в блокчейне',
                    click: (item, win) => {
                        win.loadURL('https://golos.id/allposts')
                    }
                },
                {
                    label: 'Все комментарии в БЧ',
                    click: (item, win) => {
                        win.loadURL('https://golos.id/allcomments')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Сообщить о проблеме',
                    click: () => {
                        shell.openExternal('https://golos.chatbro.com')
                    }
                },
                {
                    label: 'Открыть логи',
                    click: (menu, win) => { // Used instead of role, because works even if devtools are disconnected
                        win.toggleDevTools()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Golos Desktop ' + appSet.app_version,
                    click: () => {
                        dialog.showMessageBox({
                            message: 'Golos Desktop ' + appSet.app_version + '\n' +
                            '\n' +
                            'Версии модулей:\n' +
                            '• Блоги - ' + appSet.blogs_version + '\n' +
                            '• Кошелек - ' + appSet.wallet_version + '\n' +
                            '• Мессенджер - ' + appSet.msgs_version + '\n'
                        })
                    }
                }
            ]
        },
    ]
    if (full) {
        const settings = template[1]
        settings.submenu.push(
            {
                type: 'separator'
            },
            {
                label: 'Открыть настройки',
                click: (item, win, e) => {
                    const settings = new BrowserWindow({
                        parent: win,
                        modal: true,
                        resizable: false,
                        width: 600,
                        height: 475,
                        webPreferences: {
                            preload: __dirname + '/settings_preload.js'
                        }
                    })
                    settings.loadURL(appUrl + '/__app_settings')
                }
            }
        )
    	template = [
            {
                label: '< Назад',
                click: (item, win, e) => {
                    win.webContents.goBack()
                }
            },
            {
                label: 'Вперед >',
                click: (item, win, e) => {
                    win.webContents.goForward()
                }
            },
            {
                label: 'Перейти',
                click: (item, win, e) => {
                    let url = win.webContents.getURL() || ''
                    url = encodeURI(url)
                    url = url.replace('app://', 'https://')
                    const gotoURL = new BrowserWindow({
                        parent: win,
                        modal: true,
                        resizable: false,
                        width: 900,
                        height: 140,
                        useContentSize: true,
                        webPreferences: {
                            preload: __dirname + '/settings_preload.js'
                        }
                    })
                    ipcMain.removeAllListeners('load-url')
                    ipcMain.once('load-url', async (e, url, isExternal) => {
                        if (isExternal) {
                            shell.openExternal(url)
                        } else {
                            const curUrl = new URL(win.webContents.getURL())
                            if (curUrl.host === new URL(url).host) {
                                win.webContents.send('router-push', url)   
                            } else {
                                win.loadURL(url)
                            }
                        }
                    })
                    createContextMenu(gotoURL)
                    gotoURL.loadURL(appUrl + '/__app_goto_url?' + url)
                }
            },
            template[0], // Обновить
            settings,
            template[2], // Помощь
        ]
    }
    const menu = Menu.buildFromTemplate(template)
    return menu
}

module.exports = {
    initMenu
}
