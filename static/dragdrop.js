
fetchImage();
setTimeout( fetchImage, 250); 




let life = 3
var item = document.querySelector('.item');
item.addEventListener('dragstart', () => {
    setTimeout(() => item.classList.add("dragging"), 0);
});
const sortableList = document.querySelector(".bottom");


const items = sortableList.querySelectorAll(".item");
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
      return (e.pageX) <= sibling.offsetLeft-sortableList.scrollLeft + sibling.offsetWidth/2;
    });
    // Inserting the dragging item before the found sibling
    sortableList.insertBefore(draggingItem, nextSibling);
}
const handleDragLeave = (e) => {
  const draggingItem = document.querySelector(".dragging");
  if (e.currentTarget.contains(e.relatedTarget)) return;
  const top = document.querySelector(".top");
  top.insertBefore(draggingItem, top.firstChild);
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
      let yearElement = droppedElement.querySelector('.description .date');  // droppedElement 내의 'year' 클래스를 가진 요소만 선택
      let linkElement = droppedElement.querySelector('.description .link');
      if (yearElement) {
        yearElement.style.display = 'block';  // 해당 yearElement를 표시
        linkElement.style.display = 'block';
    }
      let currentYear = new Date(droppedElement.querySelector('.description .date').textContent);
      console.log(0,currentYear);
      let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
      let reversedSiblings = [...siblings].reverse();
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
    
    // scoring part
    let scoreflag = true
    
    let nextSibling = siblings.find(sibling => {
      return e.pageX <= sibling.offsetLeft-sortableList.scrollLeft + sibling.offsetWidth/2;
    });
    let prevSibling = reversedSiblings.find(sibling => {
      return e.pageX >= sibling.offsetLeft-sortableList.scrollLeft + sibling.offsetWidth/2;
    });
    if (nextSibling) {
      let nextSiblingYear = new Date(nextSibling.querySelector('.description .date').textContent);
      if (nextSiblingYear<currentYear){
        scoreflag = false
        console.log("틀린 연도",nextSibling)
        nextSibling = siblings.find(sibling => {
          nextSiblingYear = new Date(sibling.querySelector('.description .date').textContent);
          console.log('임시 다음 년도',nextSiblingYear,currentYear)
          return nextSiblingYear>currentYear;
        });
        console.log('수정된 다음 요소 년도',nextSibling)
        // Inserting the dragging item before the found sibling
        sortableList.insertBefore(droppedElement, nextSibling);
      }
    }
    if (prevSibling) {
      let prevSiblingYear = new Date(prevSibling.querySelector('.description .date').textContent);
      if (prevSiblingYear>currentYear){
        scoreflag = false
        prevSibling = reversedSiblings.find(sibling => {
          
          prevSiblingYear = new Date(sibling.querySelector('.description .date').textContent);
          return prevSiblingYear<currentYear;
        });
          // Inserting the dragging item before the found sibling
      if (prevSibling) {
        console.log('수정된 바로 전 요소 년도',prevSibling)
        sortableList.insertBefore(droppedElement, prevSibling.nextSibling);
      } else {
        // Inserting the dragging item at the beginning of the list
        sortableList.insertBefore(droppedElement, sortableList.firstChild);
      }
      }
    }
      if (scoreflag!=true){
      life -= 1
      if (life==0){
        scoreflag = true
        alert("You died! Click OK to replay.");
        location.reload();
      }
    }
    //making new element on the top and set an image over it
      top.appendChild(newDiv);
      var item = document.querySelector('.item');
      item.addEventListener('dragstart', () => {
      setTimeout(() => item.classList.add("dragging"), 0);
});
      fetchImage();
      document.querySelector(".life").textContent = `Life: ${life}`;
    }
  });
  } 
  catch (error) {
    console.log(error);
  }
  function fetchImage() {
    let availableElement;
    fetch('/img')
    .then(response => response.json())
    .then(video => {
        const title = video.title;
        const date = video.date;
        const thumbnail_url = video.thumbnail_url;
        const link = video.link;

        availableElement = document.querySelector('.available');
        if (availableElement) {
            const titleElement = document.createElement('p');
            titleElement.textContent = `${title}`;
            availableElement.querySelector('.description').appendChild(titleElement);

            const dateElement = document.createElement('p');
            dateElement.textContent = `${date}`;
            dateElement.classList.add('date');
            availableElement.querySelector('.description').appendChild(dateElement);

            const linkElement = document.createElement('a');
            linkElement.href = `${link}`;
            linkElement.classList.add('link');
            linkElement.textContent = "보러가기";
            availableElement.querySelector('.description').appendChild(linkElement);
        }

        if (availableElement) {
            const imageElement = availableElement.querySelector('.item_img');
            if (imageElement) {
                imageElement.src = thumbnail_url;
            }
        }
        availableElement.classList.remove("available")
        topdateElement = document.querySelector('.top .date');
        topdateElement.style.display = 'none';
        toplinkElement = document.querySelector('.top .link')
        toplinkElement.style.display = 'none'


    });
    }

  

  