const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;

const tt = require('electron-tooltip')
tt({
  position:'bottom'
})

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const base = config.base;
const extensions = config.extensions;
const ext_names = config.names;

const m1 = new MenuItem (
  {
    label: 'Files',
    submenu:[
      {
        label: 'New File',
        accelerator : 'ctrl+n',
        click () { newFile() }
      },
      {
        label: 'Open file',
        accelerator : 'ctrl+o',
        click () { openFile() }
      },
      {
        label: 'Save file',
        accelerator : 'ctrl+s',
        click () { saveFile() }
      },
      {
        label: 'Save file as',
        accelerator : 'alt+e',
        click () { saveFileAs() }
      },
      {
        label: 'Export file as',
        accelerator : 'ctrl+alt+e',
        click () { exportFile() }
      },
      {
        label: 'Reload app',
        accelerator : 'alt+r',
        visible:false,
        click (MenuItem, browserWindow, event) { location.reload()/* console.log(event)*/ }
      },
      {
        label: 'Close app',
        accelerator : 'ctrl+alt+w',
        click (MenuItem, browserWindow, event) { window.close() }
      },
      {
        label: 'Center Text',
        visible:false,
        accelerator : 'ctrl+E',
        click (MenuItem, browserWindow, event) { document.execCommand('justifyCenter') }
      }
    ]
  }
)

const saveFile = () => {
  if(typeof window.file === 'string') {
    let data = document.getElementById('content');
    let res = Buffer.from(data.innerHTML, 'utf8').toString(base)
    fs.writeFileSync(window.file, res)
  }
  else saveFileAs()
}

const openFile = () => {
  dialog.showOpenDialog({ filters: [

  { name: ext_names, extensions: extensions },
  { name: 'any', extensions: ['*']}
   
  ]}, function(fileNames) {
 
  if (typeof fileNames === 'undefined') return;
 
  var fileName = fileNames[0];
  var data = fs.readFileSync(fileName, 'utf-8')
  document.getElementById('title').innerHTML = `one brick office | ${fileName}`
  document.getElementById('content').innerHTML = Buffer.from(data, base).toString('utf-8');
  document.getElementById('default').style.display = 'none'
  document.getElementById('doc').style.display = 'block'
  window['file'] = fileName
})

}

const saveFileAs = () => {
  dialog.showSaveDialog({ filters: [

    { name: ext_names, extensions: extensions },
    { name: 'any', extensions: ['*']}

  ]}, (fileName) => {
    
    if (typeof fileName === 'undefined') return;
      
    let data = document.getElementById('content');
    let r = Buffer.from(data.innerHTML, 'utf8').toString(base)
    fs.writeFileSync(fileName, r);
    document.getElementById('title').innerHTML = `one brick office | ${fileName}`
  });  
}

const exportFile = () => {
  
  var pdf = require('html-pdf');
  var options = { format: 'Letter' };
  
  dialog.showSaveDialog({ filters: [

    { name: 'pdf', extensions: ['pdf'] },
    { name: 'any', extensions: ['*']}

  ]}, (fileName) => {
    
    if (typeof fileName === 'undefined') return;
      
    let data = document.getElementById('content');

    pdf.create(data.innerHTML, options).toFile(fileName, function(err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
    });    
  }); 

}

const insertImage = () => {
  dialog.showOpenDialog({ filters: [

    { name: 'image', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] }
     
    ]}, function(fileNames) {
   
    if (typeof fileNames === 'undefined') return;
   
    let fileName = fileNames[0];
    let img = `<img src="${fileName}"/>`
    let res = document.execCommand('insertHTML', 0,  img)
    console.log(res);
  })
}

const newFile = () => {
  document.getElementById('default').style.display = 'none'
  document.getElementById('doc').style.display = 'block'
  document.getElementById('content').innerHTML = ''
  document.getElementById('title').innerHTML = `one brick office | unsaved file(*)`
}

const insertLink = () => {
  const { ipcRenderer } = require('electron');

// Some data that will be sent to the main process
// Feel free to modify the object as you wish !
let link = document.getElementById('link');
let linkText = document.getElementById('linkText');
let Data = {
    link,
    linkText
};

// Trigger the event listener action to this event in the renderer process and send the data
ipcRenderer.send('request-update-label-in-second-window', Data);
window.close()
}

const menu = new Menu()

menu.append(m1)
remote.getCurrentWindow().setMenu(menu);