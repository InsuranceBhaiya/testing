function tabSwitch() {
  const tab = document.querySelector("#mH input[name='nav_tab_btn']:checked");
  const tabContents = tab.getAttribute("data-tabcontent");
  const tabName = tab.getAttribute("data-tabname");
  const tabsToHide = document.querySelectorAll(`.${tabContents}`);
  const tabsToDisplay = document.querySelector(`#${tabName}`);

  tabsToHide.forEach((elem) => {
    elem.style.display = "none";
  });
  tabsToDisplay.style.display = "block";
  checkActiveRadio();
}

tabSwitch();

function execCmd(command, value = null) {
  document.execCommand(command, false, value);
}

function debounce(func, delay) {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(this, args);
      timerId = null;
    }, delay);
  };
}

function createLink(target) {
  const url = prompt("Enter the URL:");
  if (url) {
    const aTag = `<a href="${url}" target="${target}" role="button">${window
      .getSelection()
      .toString()}</a>`;
    execCmd("insertHTML", aTag);
  }
}

function addImage() {
  const imageUrl = prompt("Enter the image URL:");
  const className = prompt("Enter the class name (optional):");
  if (imageUrl) {
    let imgTag = `<img src="${imageUrl}"`;
    if (className) {
      imgTag += ` class="${className}"`;
    }
    imgTag += ">";
    execCmd("insertHTML", imgTag);
  }
}

function updateCodeOutput() {
  const allBoxes = document.querySelectorAll(".content-box");
  let boxID = "";
  allBoxes.forEach((elem) => {
    const inputCheck = elem.querySelector("input[name='edit_box']").checked;
    if (inputCheck) {
      boxID = elem.getAttribute("data-box-id");
    }
  })
  if (boxID) {
    const outputDiv = document.querySelector(`#box-${boxID} #output-${boxID}`);
    const heading = document.querySelector(`#box-${boxID} #linkingText-${boxID}`).value;
    const codeEditor = document.querySelector(`#box-${boxID} #code-editor-${boxID}`);
    const innerCode = document.querySelector(`#editor-${boxID}`).innerHTML;
    if (heading.length > 0) {
      outputDiv.innerHTML = `<h5 class="h5 sub-title">${heading}</h5>` + innerCode;
    } else {
      outputDiv.innerHTML = innerCode;
    }
    codeEditor.value = innerCode;
  } else {
    alert("Please select the box first which you want to edit");
  }
}
const debouncedUpdateCodeOutput = debounce(() => {updateCodeOutput();}, 300);

function updateEditorOutput() {
  const allBoxes = document.querySelectorAll(".content-box");
  let boxID = "";
  allBoxes.forEach((elem) => {
    const inputCheck = elem.querySelector("input[name='edit_box']").checked;
    if (inputCheck) {
      boxID = elem.getAttribute("data-box-id");
    }
  })
  if(boxID) {
    const outputDiv = document.querySelector(`#box-${boxID} #output-${boxID}`);
    const heading = document.querySelector(`#box-${boxID} #linkingText-${boxID}`).value;
    const editorDiv = document.querySelector(`#editor-${boxID}`);
    const textCode = document.querySelector(`#code-editor-${boxID}`).value;
    if (heading.length > 0) {
      outputDiv.innerHTML = `<h5 class="h5 sub-title">${heading}</h5>` + textCode;
    } else {
      outputDiv.innerHTML = textCode;
    }
    editorDiv.innerHTML = textCode;
  } else {
    alert("Please select the box first which you want to edit");
  }
}
const debouncedUpdateEditorOutput = debounce(() => {updateEditorOutput();}, 300);

function wrapSelected() {
  const selection = window.getSelection();
  const selectedText = selection.toString();
  const tag = prompt("Enter the tag:");
  const className = prompt("Enter the class name (optional):");
  const id = prompt("Enter the ID (optional):");
  if (selectedText && tag) {
    let wrappedText = `<${tag}`;
    if (className) {
      wrappedText += ` class="${className}"`;
    }
    if (id) {
      wrappedText += ` id="${id}"`;
    }
    wrappedText += `>${selectedText}</${tag}>`;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const fragment = range.createContextualFragment(wrappedText);
    range.insertNode(fragment);
  }
}

function wrapCustomTag() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const wrapperTag = prompt("Enter the wrapper tag:");
    const wrapperAttributes = prompt(
      "Enter the wrapper attributes (optional):"
    );
    if (wrapperTag) {
      const wrapperElement = document.createElement(wrapperTag);
      if (wrapperAttributes) {
        const attributesArr = wrapperAttributes.split(",");
        attributesArr.forEach((attribute) => {
          const [attrName, attrValue] = attribute.split("=");
          if (attrName && attrValue) {
            wrapperElement.setAttribute(attrName.trim(), attrValue.trim());
          }
        });
      }
      range.surroundContents(wrapperElement);
    }
  }
}

let dragCard = null;
function dragDownStart() {
  const cards = document.querySelectorAll("#content_container .edit-box");

  // Add event listeners for drag events on each card
  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragover", dragOver);
    card.addEventListener("dragend", dragEnd);
  });
}
dragDownStart();

function dragStart(e) {
  dragCard = this;
  setTimeout(() => {
    this.style.opacity = "0.5";
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(this, e.clientY);
  const container = this.parentNode;

  if (afterElement == null) {
    container.appendChild(dragCard);
  } else {
    container.insertBefore(dragCard, afterElement);
  }
}

function dragEnd(e) {
  this.style.opacity = "1";
  dragCard = null;
}

function getDragAfterElement(card, y) {
  const draggableElements = [
    ...document.querySelectorAll(".edit-box:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
}

function checkActiveRadio() {
  const tab_check = document.querySelector("input[id='nav_content']").checked;
  const radioInputs = document.querySelectorAll(
    "#content_container .edit-box input[name='edit_box']"
  );
  if (tab_check) {
    document.getElementById("contentBox").disabled = false;
    document.getElementById("googleAdBox").disabled = false;
    let isActive = false;
    for (let i = 0; i < radioInputs.length; i++) {
      if (radioInputs[i].checked) {
        isActive = true;
        break;
      }
    }
    if (isActive) {
      document.getElementById("deleteBoxBtn").disabled = false;
    } else {
      document.getElementById("deleteBoxBtn").disabled = true;
    }
    showHideBox();
  } else {
    radioInputs.forEach((elem) => {
      elem.checked = false;
    })
    document.getElementById("deleteBoxBtn").disabled = true;
    document.getElementById("contentBox").disabled = true;
    document.getElementById("googleAdBox").disabled = true;
  }
}

function showHideBox() {
  const allBoxes = document.querySelectorAll(".content-box");
  allBoxes.forEach((elem) => {
    const inputCheck = elem.querySelector("input[name='edit_box']").checked;
    if (inputCheck) {
      elem.querySelector(".card-main-container").style.setProperty("display", "block");
    } else {
      elem.querySelector(".card-main-container").style.setProperty("display", "none");
    }
  })
}
showHideBox();

function deleteElement() {
  const radioInputs = document.querySelectorAll(
    "#content_container .edit-box input[name='edit_box']"
  );
  let selectedId = null;
  for (let i = 0; i < radioInputs.length; i++) {
    if (radioInputs[i].checked) {
      selectedId = radioInputs[i].id.replace("radio-", "box-");
      break;
    }
  }
  if (selectedId) {
    const element = document.getElementById(selectedId);
    const boxID = element.getAttribute("data-box-id");
    const boxType = element.getAttribute("data-box-type");
    if (
      element &&
      confirm(
        `Do you really want to delete this ${boxType} with id: "${boxID}"`
      )
    ) {
      element.remove();
    }
  }
  checkActiveRadio();
}

// Content Card
document.getElementById("contentBox").addEventListener("click", function () {
  setElementValues();
  const radioInputs = document.querySelectorAll(
    "#content_container .edit-box input[name='edit_box']"
  );
  radioInputs.forEach((elem) => {
    elem.checked = false;
  })
  const container = document.getElementById("content_container");
  const boxID = generateRandomId(10);
  const newElement = `
        <div class="edit-box content-box" id="box-${boxID}" data-box-type="content" data-box-id="${boxID}" draggable="true">
            <input type="radio" name="edit_box" id="radio-${boxID}" onchange="checkActiveRadio();" checked>
            <label for="radio-${boxID}">
                <div class="box">
                  <p class="text-secondary mb-0"><small>${boxID}</small></p>
                  <div class="card-main-container mt-2">
                    <div class="row mb-3">
                      <div class="col-6">
                          <div class="form-floating">
                              <input type="text" class="form-control shadow-none" id="linkingText-${boxID}" data-id="${boxID}" name="linking-name" onkeyup="debouncedCreateUrl(this)" placeholder="name@example.com">
                              <label for="linkingText-${boxID}">Linking Text</label>
                          </div>
                      </div>
                      <div class="col-6">
                          <div class="form-floating">
                              <input type="text" class="form-control shadow-none" id="linkedID-${boxID}" name="linked-id" placeholder="name@example.com" readonly>
                              <label for="linkedID-${boxID}">Linking ID</label>
                          </div>
                      </div>
                  </div>
                  <div class="row mb-1">
                      <div class="col-7">
                          <label for="editor-${boxID}">Editor</label>
                          <div class="editor scrollbar form-control shadow-none" id="editor-${boxID}" contenteditable="true" oninput="debouncedUpdateCodeOutput()"></div>
                      </div>
                      <div class="col-5">
                          <label for="code-editor-${boxID}">Code</label>
                          <textarea class="code-editor form-control shadow-none scrollbar" name='code-editor' id="code-editor-${boxID}" rows="1" onkeyup="debouncedUpdateEditorOutput()"></textarea>
                      </div>
                  </div>
                </div>
                <div class="output form-control py-3 px-5 mt-2" id="output-${boxID}"></div>
              </div>
            </label>
        </div>`;
  container.innerHTML += newElement;
  dragDownStart();
  checkActiveRadio();
});

// Google Ad Card
document.getElementById("googleAdBox").addEventListener("click", function () {
  setElementValues();
  const radioInputs = document.querySelectorAll(
    "#content_container .edit-box input[name='edit_box']"
  );
  radioInputs.forEach((elem) => {
    elem.checked = false;
  })
  const container = document.getElementById("content_container");
  const boxID = generateRandomId(10);
  const newElement = `
        <div class="edit-box ad-box" id="box-${boxID}" data-box-type="google-ad" data-box-id="${boxID}" draggable="true">
            <input type="radio" name="edit_box" id="radio-${boxID}" onchange="checkActiveRadio();" checked>
            <label for="radio-${boxID}">
              <div class="box text-center py-2 bg-secondary text-white rounded">Google Ad (${boxID})</div>
            </label>
        </div>`;
  container.innerHTML += newElement;
  dragDownStart();
  checkActiveRadio();
});


function setElementValues() {
  const inputs = document.getElementsByTagName('input');
  const textareas = document.getElementsByTagName('textarea');

  // Set values for input fields
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    input.setAttribute('value', input.value);
  }

  // Set values for textareas
  for (let i = 0; i < textareas.length; i++) {
    const textarea = textareas[i];
    textarea.setAttribute('value', textarea.value);
    textarea.innerText = textarea.value;
  }
}


function createSeoFriendlyUrlKey(inputString) {
  const replaceMap = {
    ' ': '-',
    '?': '',
    "'": '',
  };
  // Replace symbols with their corresponding URL-friendly keys
  let result = inputString.replace(/[ ?']/g, (match) => replaceMap[match]);
  // Remove consecutive dashes
  result = result.replace(/-+/g, '-');
  // Remove consecutive "
  result = result.replace(/"+/g, '');
  // Remove leading and trailing dashes
  result = result.replace(/^-+|-+$/g, '');

  return result.toLowerCase(); // Convert to lowercase for consistency
}

const debouncedCreateUrl = debounce((elem) => {
  const inputValue = elem.value;
  const boxId = elem.getAttribute("data-id");
  const seoFriendlyKey = createSeoFriendlyUrlKey(inputValue);
  document.getElementById(`linkedID-${boxId}`).value = seoFriendlyKey;
}, 300); // 300 milliseconds delay before executing the function


function saveContentData() {
  // Get all edit-box elements
  const editBoxes = document.querySelectorAll(".edit-box");

  // Create an array to store the card data
  const cardData = [];

  // Iterate over each edit-box
  editBoxes.forEach((editBox) => {
    // Create an object to hold the card's data
    const card = {};

    card.id = editBox.getAttribute("data-box-id");  

    const card_type = editBox.getAttribute("data-box-type");
    card.cardType = card_type;

    if (card_type === "content") {
      // Get the linking text value
      const linkingText = editBox.querySelector(
        'input[id^="linkingText-"]'
      ).value;
      card.linkingText = linkingText;

      // Get the linking ID value
      const linkedID = editBox.querySelector('input[id^="linkedID-"]').value;
      card.linkedID = linkedID;

      // Get the code editor content
      const codeEditorContent = editBox.querySelector(
        'textarea[id^="code-editor-"]'
      ).value;
      card.codeEditorContent = codeEditorContent;
    }

    // Add the card object to the cardData array
    cardData.push(card);
  });
  const data = {
    'name': document.getElementById("article_name").value,
    'url': document.getElementById("article_url").value,
    'thumbnail': document.getElementById("thumbnail").value,
    "basic": {
      'recommendation_title': document.getElementById("recommendation_title").value,
      'short_description': document.getElementById("short_description").value,
      'sub_article_title': document.getElementById("sub_article_title").value,
      'thumbnail': document.getElementById("recommendation_thumbnail").value,
      'content_keywords': document.getElementById("content_keywords").value,
      'sidebar_keywords': document.getElementById("sidebar_keywords").value,
      "sub_article": {
        'is_sub_article': document.getElementById("is_sub_article").checked,
        'id': document.getElementById("sub_article_id").value,
      },
    },
    "seo": {
      "title": document.getElementById("head_title").value,
      "image_url": document.getElementById("head_image_url").value,
      "description": document.getElementById("head_description").value,
      "keywords": document.getElementById("head_keywords").value,
    },
    "content": {
      "heading": document.getElementById("contentHeading").value,
      "content": cardData
    },
    'recommendation': {
      'previous_article_id': document.getElementById("previous_article_id").value,
      'next_article_id': document.getElementById("next_article_id").value,
      'recommendation_article_id': document.getElementById("recommendation_article_id").value,
      'sub_article_id_1': document.getElementById("sub_article_id_1").value,
      'sub_article_id_2': document.getElementById("sub_article_id_2").value,
      'sub_article_id_3': document.getElementById("sub_article_id_3").value,
    },
  }

  sendDataToDB(data, "update")
}

function getIdFromUrl(url) {
  const parts = url.split('/');
  return parts.at(-1);
}

function sendDataToDB(dataToSave, requestForData) {
  // Get the current URL
  const currentURL = window.location.pathname;
    
    // Defining async function
    async function saveArticleData() {
      await $.ajax({
          type: "POST",
          async: false,
          url: currentURL,
          data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              data: JSON.stringify(dataToSave),
              [requestForData]: true,
          },
          success: function (response) {
              if (response.ok) {
                alert(response.msg);
              } else {
                alert(response.msg)
              }
          }
      })
      .catch((error) => {
        alert("Error: ",error)
      });
  }
  saveArticleData();
}


