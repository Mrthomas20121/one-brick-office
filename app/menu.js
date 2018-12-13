const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;

const tt = require('electron-tooltip')
tt({
  position:'bottom'
})

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
        label: 'Save file as',
        accelerator : 'ctrl+s',
        click () { saveFile() }
      },
      {
        label: 'close',
        accelerator : 'ctrl+w',
        click () { location = 'Closed.html' }
      }
    ]
  }
)

var fs = require('fs');

const openFile = () => {
  dialog.showOpenDialog({ filters: [

  { name: 'one brick office file', extensions: ['obo'] }
   
  ]}, function(fileNames) {
 
  if (typeof fileNames === "undefined") return;
 
  var fileName = fileNames[0];
  fs.readFile(fileName, 'utf-8', (err, data) => {
    if(err) throw err;
    
    document.getElementById('title').innerHTML = `one brick office | ${fileName}`
    document.getElementById('content').innerHTML = Buffer.from(data, 'base64').toString('utf-8');
    document.getElementById('default').style.display = 'none'
    document.getElementById('doc').style.display = 'block'
   })
})

}

const saveFile = () => {
  dialog.showSaveDialog({ filters: [

    { name: 'one brick office file', extensions: ['obo'] },
    { name: 'any', extensions: ['*']}

  ]}, (fileName) => {
    
  if (typeof fileName === "undefined") return;
    
  let data = document.getElementById('content');
  let r = Buffer.from(data.innerHTML).toString('base64')
  fs.writeFileSync(fileName, r);

});  
}

const exportFile = () => {
  
  var pdf = require('html-pdf');
  var html = fs.readFileSync(fileName, 'utf8');
  var options = { format: 'Letter' };
  
  pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
}

const insertImage = () => {
  dialog.showOpenDialog({ filters: [

    { name: 'image', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] }
     
    ]}, function(fileNames) {
   
    if (typeof fileNames === "undefined") return;
   
    let fileName = fileNames[0];
    let img = `<img src="${fileName}"/>`
    let res = document.execCommand('insertHTML', 0,  img)
    console.log(res);
  })
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
}

const menu = new Menu()

menu.append(m1)
remote.getCurrentWindow().setMenu(menu);