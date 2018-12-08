const {app, dialog, BrowserWindow, Tray, Menu} = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')

require('electron-context-menu')({
	prepend: (params, browserWindow) => []
});

var mainWindow;
app.on('ready', function() {

  mainWindow = new BrowserWindow({
    name: 'one brick office',
    width: 720,
    height: 720,
    icon: path.join(__dirname, `/app/images/one_brick_office_logo.png`)
   })

app.on('window-all-closed', function() {
  app.quit();
});

app.on('open-file', function (event, file) {
  var content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
});

// loading the menu in the renderer process
mainWindow.setMenu(null)

mainWindow.loadURL(url.format({
  pathname: path.join(__dirname, `/app/index.html`),
  protocol: 'file:',
  slashes: true
}))

});
