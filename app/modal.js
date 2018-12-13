const modal = () => {
  const { remote , ipcMain } = require('electron');
  const path = require('path');
  
  const winModal = new remote.BrowserWindow({
    name: "Insert a link",
    width: 300,
    height: 300,
    parent: remote.getCurrentWindow(), 
    modal: true, 
    show: false,
    icon:path.join(__dirname, `/app/images/one_brick_office_logo.png`),
    //frame:false
  });

  winModal.loadURL(path.join(__dirname, "insertLink.html"))
    winModal.once('ready-to-show', () => {
      winModal.show()
      ipcMain.on('request-update-label-in-second-window', (event, arg) => {
        // Request to update the label in the renderer process of the second window
        // We'll send the same data that was sent to the main process
        // Note: you can obviously send the 
        winModal.webContents.send('action-update-label', arg);
    });
  });

}
