
// 모달 창과 버튼에 대한 참조를 가져옵니다.


var modal = document.getElementById("selectingModal");
var btn = document.getElementById("submitDate");
// 페이지 로드 시 모달 창을 띄웁니다.
window.onload = function() {
  modal.style.display = "block";
}
// 사용자가 버튼을 클릭하면 모달 창을 닫고 JavaScript의 나머지 부분을 실행합니다.
btn.onclick = function() {
  let year = document.getElementById('year').value.padStart(4, '0');
  let month = document.getElementById('month').value.padStart(2, '0');
  let day = document.getElementById('day').value.padStart(2, '0');
  
// 가져온 값을 사용하여 날짜 문자열을 만듭니다.
let selectedDate = `${year}-${month}-${day}`;
modal.style.display = "none";
fetchImage(selectedDate).then(() =>{
  return fetchImage(selectedDate);
}).then(() =>{
  displayFirstOne();
});

let currentYear = 0
let life = 3
let score = 0
var item = document.querySelector('.item');
function handleDragStart(event) {
  setTimeout(() => event.target.classList.add("dragging"), 0);
}
item.addEventListener('dragstart', handleDragStart);
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
    // Check if the dropped element has he item class
    // as item dropped, remove the dragging class, set draggable false, make new img on top, and scoring part
    if (droppedElement && droppedElement.classList.contains("item")) {
      droppedindex = droppedElement.querySelector('.description p').dataset.index;
      delay(270).then(() => {
        return fetchDate(droppedindex);
      }).then((result) => {
        dropdatelink = result;
        
        const dateElement = document.createElement('p');
        dateElement.textContent = `${dropdatelink[0]}`;
        dateElement.classList.add('date');
        droppedElement.querySelector('.description').appendChild(dateElement);
        
        const linkElement = document.createElement('a');
        linkElement.href = `${dropdatelink[1]}`;
        linkElement.target = '_blank';
        linkElement.classList.add('link');
        linkElement.textContent = "보러가기";
        droppedElement.querySelector('.description').appendChild(linkElement);
        currentYear = new Date(droppedElement.querySelector('.description .date').textContent);
      let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
      let reversedSiblings = [...siblings].reverse();
      droppedElement.classList.remove("dragging");
      droppedElement.setAttribute('draggable','false');
      droppedElement.removeEventListener('dragstart',handleDragStart);
      const top = document.querySelector(".top");
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'item available');
      newDiv.setAttribute('draggable', 'true');
      newDiv.innerHTML = `
      <img class="item_img" alt="Random Image">
      <div class="description"></div>
    `;
    
    // scoring part
    let scoreflag = true;
    
    let nextSibling = siblings.find(sibling => {
      return e.pageX <= sibling.offsetLeft-sortableList.scrollLeft + sibling.offsetWidth/2;
    });
    let prevSibling = reversedSiblings.find(sibling => {
      return e.pageX >= sibling.offsetLeft-sortableList.scrollLeft + sibling.offsetWidth/2;
    });
    if (nextSibling) {
      let nextSiblingYear = new Date(nextSibling.querySelector('.description .date').textContent);
      if (nextSiblingYear<currentYear){
        scoreflag = false;
        nextSibling = siblings.find(sibling => {
          nextSiblingYear = new Date(sibling.querySelector('.description .date').textContent);
          return nextSiblingYear>currentYear;
        });
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
        sortableList.insertBefore(droppedElement, prevSibling.nextSibling);
      } else {
        // Inserting the dragging item at the beginning of the list
        sortableList.insertBefore(droppedElement, sortableList.firstChild);
      }
      }
    }
    if (scoreflag != true) {
      life -= 1;
      if (life == 0) {
          scoreflag = true;
          // Show the modal
          let modal = document.getElementById("myModal");
          modal.style.display = "block";
          if (score == 0){
            document.querySelector(".phrase").textContent = "입문 날짜에 착오가 있네요";
          }
          else if(score<3){
            document.querySelector(".phrase").textContent = "신규 구독자시군요";
          }
          else if(score<5){
            document.querySelector(".phrase").textContent = "팬치 입문";
          }
          else if(score<10){
            document.querySelector(".phrase").textContent = "영상 꾸준히 보는 사람";
          }
          else if(score<15){
            document.querySelector(".phrase").textContent = "슬슬 공급이 수요를 못 따라가는 단계";
          }
          else if(score<18){
            document.querySelector(".phrase").textContent = "왁튜브 상시 거주중";
          }
          else if(score>17){
            document.querySelector(".phrase").textContent = "타의 모범이 되는 충신입니다.";
          }

          // When the user clicks on the button, close the modal and reload the page
          document.getElementById("replay").onclick = function() {
              modal.style.display = "none";
              location.reload();
          }
          return;
      }
    
  }
    else{
      score+=1;
      document.querySelector(".score").textContent = score;
    }

    //making new element on the top and set an image over it
      top.appendChild(newDiv);
      var item = document.querySelector('.item');
      item.addEventListener('dragstart', handleDragStart);
      fetchImage(selectedDate);
      if (life==2){
        document.querySelector(".life").textContent = "❤️❤️";
      }
      else if(life==1){
        document.querySelector(".life").textContent = "❤️";
      }  
    }).catch((error) => {
        console.error(error);
      });



      
    }
  });
  } 
  catch (error) {
    console.log(error);
  }
}
  function fetchImage(selectedDate) {
    return new Promise((resolve, reject) => {
    let availableElement;
    fetch(`/img?date=${selectedDate}`)
    .then(response => response.json())
    .then(data => {
      let video = data[0];
      let resultindex = data[1];
      if (video.error) {
        // Show the modal
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
        document.querySelector(".phrase").innerHTML = "축하합니다! 모든 동영상의 순서가 완벽합니다.<br> 유튭팬치의 모범을 보입니다."
        // When the user clicks on the button, close the modal and reload the page
        document.getElementById("replay").onclick = function() {
            modal.style.display = "none";
            location.reload();
        }
    }
        const title = video.title;
        const date = video.date;
        const thumbnail_url = video.thumbnail_url;
        const link = video.link;

        availableElement = document.querySelector(' .available');
        if (availableElement) {
            const titleElement = document.createElement('p');
            titleElement.setAttribute('data-index',resultindex)
            titleElement.textContent = `${title}`;
            availableElement.querySelector('.description').appendChild(titleElement);

        }

        if (availableElement) {
            const imageElement = availableElement.querySelector('.item_img');
            if (imageElement) {
                imageElement.src = thumbnail_url;
            }
        }
        availableElement.classList.remove("available")
        resolve();  // 모든 처리가 완료되면 Promise를 해결합니다.
      })
      .catch(error => {
          reject(error);  // 에러가 발생하면 Promise를 거부합니다.
      });
  });
};
  


function fetchDate(videoindex) {
  return new Promise((resolve, reject) => {
      fetch(`/date?index=${videoindex}`)
      .then(response => response.json())
      .then(data => {
          let date = data[0];
          let link = data[1];
          resolve([date, link]);  // 모든 처리가 완료되면 Promise를 해결합니다.
      })
      .catch(error => {
          reject(error);  // 에러가 발생하면 Promise를 거부합니다.
      });
  });
}


  function delay(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
  }

  function displayFirstOne() {
    let firstone = document.querySelector('.bottom .item');
    let firstdescription = firstone.querySelector('.description');
    let firstindex = firstdescription.querySelector('p');
    let firstonedatelink;
    firstindex = firstindex.dataset.index;
    
    delay(270).then(() => {
      return fetchDate(firstindex);
    }).then((result) => {
      firstonedatelink = result;
      
      const dateElement = document.createElement('p');
      dateElement.textContent = `${firstonedatelink[0]}`;
      dateElement.classList.add('date');
      firstone.querySelector('.description').appendChild(dateElement);
      
      const linkElement = document.createElement('a');
      linkElement.href = `${firstonedatelink[1]}`;
      linkElement.target = '_blank';
      linkElement.classList.add('link');
      linkElement.textContent = "보러가기";
      firstone.querySelector('.description').appendChild(linkElement);
    }).catch((error) => {
      console.error(error);
    });
  }

  function displayDateLink(index){
    delay(270).then(() => {
      return fetchDate(firstindex);
    }).then((result) => {
      firstonedatelink = result;
      
      const dateElement = document.createElement('p');
      dateElement.textContent = `${firstonedatelink[0]}`;
      dateElement.classList.add('date');
      firstone.querySelector('.description').appendChild(dateElement);
      
      const linkElement = document.createElement('a');
      linkElement.href = `${firstonedatelink[1]}`;
      linkElement.target = '_blank';
      linkElement.classList.add('link');
      linkElement.textContent = "보러가기";
      firstone.querySelector('.description').appendChild(linkElement);
    }).catch((error) => {
      console.error(error);
    });
  }

  