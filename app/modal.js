const modal = () => {
  const { remote } = require('electron')
  const path = require('path');
  
  const winModal = new remote.BrowserWindow({
    name: "Insert a link",
    width: 300,
    height: 300,
    parent: remote.getCurrentWindow(), 
    modal: true, 
    show: false,
    frame:true,
    icon:path.join(__dirname, `/app/images/one_brick_office_logo.png`)
  });

  winModal.loadURL(path.join(__dirname, "insertLink.html"))
    winModal.once('ready-to-show', () => {
      winModal.show()
      remote.ipcMain.on('insert_link', (event, arg) => {
        // send the link to the main windows
        console.log(JSON.stringify(arg, null, 2));
        winModal.webContents.send('link', arg);
      });
  });

}
