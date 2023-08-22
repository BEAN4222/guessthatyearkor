
fetchImage();
setTimeout(fetchImage, 250); // 1000ms = 1 second delay
var item = document.querySelector('.item');
item.addEventListener('dragstart', () => {
    setTimeout(() => item.classList.add("dragging"), 0);
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
    console.log('tlqkf anjdi')
}
const handleDragLeave = (e) => {
  const draggingItem = document.querySelector(".dragging");
  if (e.currentTarget.contains(e.relatedTarget)) return;
  const top = document.querySelector(".top");
  top.insertBefore(draggingItem, top.firstChild);
  console.log('leave')
}
sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragleave", handleDragLeave);
try {
    sortableList.addEventListener("drop", (e) => {
    // e.preventDefault();
    // Get the dropped element
    const droppedElement = document.querySelector(".dragging");
    // Check if the dropped element has the item class
    // as item dropped, remove the dragging class, set draggable false, make new img on top, and scoring part
    if (droppedElement && droppedElement.classList.contains("item")) {
      console.log("Item dropped");
      let currentYear = droppedElement.querySelector('.description p');
      droppedElement.classList.remove("dragging");
      droppedElement.setAttribute('draggable','false');
      const top = document.querySelector(".top");
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'item available');
      newDiv.setAttribute('draggable', 'true');
      newDiv.innerHTML = `
      <img class="item_img" alt="Random Image">
      <div class="description"></div>
    `;
    let siblings = [...sortableList.querySelectorAll(".item")];
    let nextSibling = siblings.find(sibling => {
      return e.clientX <= sibling.offsetLeft + sibling.offsetWidth / 2;
    });
    let prevSibling = siblings.find(sibling => {
      return e.clientX >= sibling.offsetLeft + sibling.offsetWidth / 2;
    });
    if (nextSibling) {
      const nextSiblingMetadata = nextSibling.querySelector('.description p');
      
    }
    if (prevSibling) {
      const prevSiblingMetadata = prevSibling.querySelector('.description p');
    }
    


      top.appendChild(newDiv);
      var item = document.querySelector('.item');
      item.addEventListener('dragstart', () => {
      setTimeout(() => item.classList.add("dragging"), 0);
});
      fetchImage();
    }
  });
  } catch (error) {
    console.log(error);
  }

  function fetchImage() {
    let availableElement;
    fetch('/img')
      .then(response => {
          const metadata = response.headers.get('x-amz-meta-year');
          availableElement = document.querySelector('.available');
          if (availableElement) {
              const metadataElement = document.createElement('p');
              metadataElement.textContent = `Metadata: ${metadata}`;
              availableElement.querySelector('.description').appendChild(metadataElement);
          }
          return response.blob();
      })
      .then(blob => {
          const imageUrl = URL.createObjectURL(blob);
          if (availableElement) {
              const imageElement = availableElement.querySelector('.item_img');
              if (imageElement) {
                  imageElement.src = imageUrl;
              }
          }
        availableElement.classList.remove("available")
      });
  }
  