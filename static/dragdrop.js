fetchImage()
var item = document.querySelector('.item');
item.addEventListener('dragstart', () => {
    setTimeout(() => item.classList.add("dragging"), 0);
});
item.addEventListener('dragend', () => {
    item.classList.remove("dragging");
    item.setAttribute('draggable','false');
    
});

const sortableList = document.querySelector(".bottom");
console.log(sortableList)
const items = sortableList.querySelectorAll(".item");
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
      return e.clientX <= sibling.offsetLeft + sibling.offsetWidth / 2;
    });
    // Inserting the dragging item before the found sibling
    sortableList.insertBefore(draggingItem, nextSibling);
}
sortableList.addEventListener("dragover", initSortableList);

try {
    sortableList.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log('what the fuck')
      fetchImage();
    });
  } catch (error) {
    console.log(error);
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

