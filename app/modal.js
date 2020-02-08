const modal = () => {
  const { remote } = require('electron')
  const path = require('path');
  
  // creation of the window
  const winModal = new remote.BrowserWindow({
    name: "Link?",
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
      // send the link to the main window
      remote.ipcMain.on('insert_link', (event, arg) => {
        // print the arg to see if it show
        console.log(JSON.stringify(arg, null, 2));
        // send arg to the main window
        winModal.webContents.send('link', arg);
      });
  });
}
