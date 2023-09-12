const { ipcRenderer } = require('electron')

process.once('loaded', () => {
    window.addEventListener('message', evt => {
        if (evt.data.type === 'select-dirs') {
            ipcRenderer.send('select-dirs')
        } else if (evt.data.type === 'command') {
            ipcRenderer.send('run-command', evt.data)
        }
    })
})

ipcRenderer.on('directory', (e, data) => {
    if (data.filePaths[0]) {
        document.getElementById('directoryPath').value = data.filePaths[0]
    }
})