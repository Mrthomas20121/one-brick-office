const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;

// in the render process..
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
    
    // console.log(data);
    document.getElementById('content').innerHTML = data;
   })
})

}

const saveFile = () => {
  dialog.showSaveDialog({ filters: [

    { name: 'one brick office file', extensions: ['obo', 'html'] },
    { name: 'any', extensions: ['*']}

  ]}, (fileName) => {
    
  if (typeof fileName === "undefined") return;
    
  let data = document.getElementById('content');
  
  fs.writeFileSync(fileName, data.innerHTML);

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

const menu = new Menu()

menu.append(m1)
remote.getCurrentWindow().setMenu(menu);