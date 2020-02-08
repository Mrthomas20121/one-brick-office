const content = document.getElementById('content');

content.addEventListener('input', (event) => {
  if(typeof window.file === 'string') {
    let title = document.getElementById('title')
    if(!title.innerHTML == `one brick office | ${file}, unsaved(*)`) {
      title.innerHTML = `one brick office | ${file}, unsaved(*)`
    } 
  }
})