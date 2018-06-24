const filters = [' ', '_1977', 'aden', 'brannan', 'brooklyn', 'clarendon', 'earlybird', 'gingham', 'hudson', 'inkwell', 'kelvin', 'lark', 'lofi', 'maven', 'mayfair', 'moon', 'nashville', 'perpetua', 'reyes', 'rise', 'slumber', 'stinson', 'toaster', 'valencia', 'walden', 'willow', 'xpro2']
window.URL = window.URL || window.webkitURL

const fileElem = document.getElementById('fileButton')
const img = document.getElementById('image-render')

function handleFiles (files) {
  if (!files.length) {
    console.log('No files selected!')
  } else {
    const urlImage = window.URL.createObjectURL(files[0])
    img.src = urlImage
    fileElem.classList.toggle('d-none')
    img.classList.toggle('d-none')

    for (let filter of filters) {
      const label = document.createElement('label')
      label.style.display = 'inline'
      label.onclick = applyFilter

      const inputFilter = document.createElement('input')
      inputFilter.type = 'radio'
      inputFilter.name = 'filtro'
      inputFilter.value = filter
      label.appendChild(inputFilter)

      const imgFilter = document.createElement('img')
      imgFilter.src = urlImage
      imgFilter.className = filter + ' rounded'
      imgFilter.style.width = '8em'
      label.appendChild(imgFilter)

      filtersContainer.appendChild(label)
    }

    const firstFilter = document.querySelector('[type=radio]')
    firstFilter.checked = true

    const imageName = files[0].name.replace(/[^a-z0-9]+/g, '_')
    fetch('/upload-url?filename=' + imageName).then(function (response) {
      response.json().then(function (obj) {
        uploadFile(files[0], obj.url)
        foto.value = imageName
      })
    })
  }
}

function applyFilter () {
  const selectedRadio = document.querySelector('input:checked')
  if (selectedRadio) {
    img.className = 'img-fluid rounded mx-auto ' + selectedRadio.value
  }
}

filtersContainer.addEventListener('wheel', function (e) {
  this.scrollLeft += (e.deltaY * 50)
  e.preventDefault()
})

function uploadFile (file, url) {
  const btnPublicar = document.querySelector('#btn-publicar')
  btnPublicar.disabled = true
  var xhr = new XMLHttpRequest()
  xhr.open('PUT', url, true)
  xhr.send(file)
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(`Uploaded ${file.name}. ${xhr.response}`)
      btnPublicar.disabled = false
    }
  }
}
