fetchImage()
var item = document.querySelector('.item');
item.addEventListener('dragstart', dragstart);


function allowDrop(ev) {
  ev.preventDefault();
  }

function dragstart(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drop(ev) {
  if (ev.target.classList.contains('bottom')) {
    var data = ev.dataTransfer.getData("text/plain");
    var node = document.getElementById(data);
    ev.target.appendChild(node);
    node.draggable = false;
    ev.preventDefault();
    // Create a new item div in the top div
    var topDiv = document.querySelector('.top');
    var newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.id = 'newItem';
    newItem.draggable = true;
    newItem.innerHTML = '<img class="item_img" alt="Random Image"><div class="description"></div>';
    topDiv.appendChild(newItem);

    // Add event listener for dragstart
    newItem.addEventListener('dragstart', dragstart);

    // Fetch new image and metadata
    fetchImage();
  }
}

function fetchImage() {
  fetch('/img')
    .then(response => {
        const metadata = response.headers.get('x-amz-meta-year');
        const metadataElement = document.createElement('p');
        metadataElement.textContent = `Metadata: ${metadata}`;
        document.querySelector('.description').appendChild(metadataElement);
        return response.blob();
    })
    .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.querySelector('.item_img');
        imageElement.src = imageUrl;
    });
}

