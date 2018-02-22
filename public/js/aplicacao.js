const filters = ["", "1977", "aden", "brannan", "brooklyn", "clarendon", "earlybird", "gingham", "hudson",  "inkwell", "kelvin", "lark", "lofi", "maven", "mayfair", "moon", "nashville", "perpetua", "reyes", "rise", "slumber", "stinson", "toaster", "valencia", "walden", "willow", "xpro2"]
window.URL = window.URL || window.webkitURL

var fileElem = document.getElementById("foto"),
  img = document.getElementById("image-render")

function handleFiles(files) {
  if (!files.length) {
    console.log("No files selected!")
  } else {
    const urlImage = window.URL.createObjectURL(files[0])
    img.src = urlImage;
    fileElem.classList.toggle('d-none')
    img.classList.toggle('d-none')

    for(let filter of filters) {
      const label = document.createElement("label")
      label.style.display = "inline"
      label.onclick = applyFilter
      
      const inputFilter = document.createElement("input")
      inputFilter.type = "radio"
      inputFilter.name = "filtro"
      inputFilter.value = filter
      label.appendChild(inputFilter)

      const imgFilter = document.createElement("img")
      imgFilter.src = urlImage
      imgFilter.className = filter + " rounded"
      imgFilter.style.width = "8em"
      label.appendChild(imgFilter)

      filtersContainer.appendChild(label)
    }
  }
}

function applyFilter () {
  const selectedRadio = document.querySelector('input:checked')
  img.className = "img-fluid rounded mx-auto " + selectedRadio.value
}
