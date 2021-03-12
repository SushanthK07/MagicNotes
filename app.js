console.log("Welcome to Notes app. This is app.js");
// showNotes();

let userDetails = document.getElementById('userDetails');
let userName = document.getElementById('userName');
let submitBtn = document.getElementById('submitBtn');
let welcomeMessage = document.getElementById('welcomeMessage');

submitBtn.onclick = function() {
    nameOfUser = userName.value;
    if (nameOfUser == "") {
        alert("Enter valid name");
        return;
    }
    localStorage.setItem('notesUserName', nameOfUser);
    userName.value = "";
    displayWelcomeMessage(nameOfUser);
    showNotes();
};

var nameOfUser = localStorage.getItem('notesUserName');
if (nameOfUser !== null) {
    displayWelcomeMessage(nameOfUser);
}

function displayWelcomeMessage(nameOfUser) {
    let message = document.createElement('h5');
    message.classList.add("py-4");
    message.textContent = "Welcome to the Magic Notes, " + nameOfUser;
    welcomeMessage.appendChild(message);
    userDetails.style.display = 'none';

    let changeUserContainer = document.createElement('div');
    changeUserContainer.classList.add("d-flex", "flex-row");
    welcomeMessage.appendChild(changeUserContainer);

    let changeUserText = document.createElement('h5');
    changeUserText.classList.add('py-4', 'text-right', 'mr-3');
    changeUserText.textContent = `Not ${nameOfUser}?`;
    changeUserContainer.appendChild(changeUserText);

    let changeUserBtn = document.createElement("button");
    changeUserBtn.classList.add("btn", "btn-primary", "btn-sm", 'my-4');
    changeUserBtn.textContent = "Click Here";
    changeUserBtn.setAttribute('onclick', 'changeUser()');
    changeUserContainer.appendChild(changeUserBtn);
}

function changeUser() {
    // console.log("Change user is triggered");
    userDetails.style.display = "block";
    welcomeMessage.innerHTML = "";
    
    let notesElement = document.getElementById('notes');
    notesElement.innerHTML = `Enter your Name to show your Notes`;
}

// if user adds a note, add it to the local storage

let addNoteBtn = document.getElementById("addBtn");
addNoteBtn.addEventListener('click', function (e) {
    
    let addTitle = document.getElementById('addTitle');
    let addTxt = document.getElementById('addTxt');
    let currentNoteObj = {
        title: addTitle.value,
        description: addTxt.value,
        isImportant: false
    };

    let keyOfNotes = "notesOf" + nameOfUser;
    let notes = localStorage.getItem(keyOfNotes);

    let notesObj = [];
    if (notes != null) {
        notesObj = JSON.parse(notes);
    }

    // notesObj.push(addTxt.value);
    notesObj.push(currentNoteObj);
    localStorage.setItem(keyOfNotes, JSON.stringify(notesObj));
    addTitle.value = "";
    addTxt.value = "";
    // console.log(notesObj);

    showNotes();
});

// to show notes from local storage

function showNotes(important = null) {
    let keyOfNotes = "notesOf" + nameOfUser;
    let notes = localStorage.getItem(keyOfNotes);
    let notesObj = [];
    if (notes != null) {
        notesObj = JSON.parse(notes);
    }

    let html = "";
    // <h5 class="card-title">Note ${index + 1}</h5>

    // console.log(important);
    notesObj.forEach(function (element, index) {
        // console.log(element.isImportant);
        if (important != null && element.isImportant === false) {
            return;
        }
        else {
            let btnClass = "btn-outline-primary";
            let btnText = "Mark";
            let markStatus = "";
            if (element.isImportant) {
                btnClass = "btn-primary";
                btnText = "Unmark";
                markStatus = `<i class="fas fa-bookmark text-primary"></i>`;
            }
            html += `
                <div class="col-12 col-md-6 col-lg-4 my-3 noteCardContainer"> 
                    <div class="card noteCard">
                        <div class="note-text card-body">
                            <h5 class="card-title">${element.title}<small> ${markStatus}</small></h5>
                            <p class="card-text">${element.description}</p>
                            <button id="imp${index}" class="btn ${btnClass}" onclick="addToImp(${index}, this.id)">${btnText}</button>
                            <button id="${index}" class="btn btn-danger" onclick="deleteNote(this.id)">Delete</button>
                        </div>
                    </div>
                </div>
                `;
        }
    });
    let notesElement = document.getElementById('notes');
    if (notesObj.length != 0) {
        notesElement.innerHTML = html;
    }
    else {
        notesElement.innerHTML = `Nothing to show! Use 'Add a Note' section above to add notes`;
    }
}

// to delete a note
function deleteNote(index) {
    // console.log("I'm deleting", index)

    let keyOfNotes = "notesOf" + nameOfUser;
    let notes = localStorage.getItem(keyOfNotes);
    let notesObj = [];
    if (notes != null) {
        notesObj = JSON.parse(notes);
    }

    notesObj.splice(index, 1);
    localStorage.setItem(keyOfNotes, JSON.stringify(notesObj));
    showNotes();
}

// to search a note
let search = document.getElementById('searchText');
search.addEventListener('input', function () {
    let inputValue = search.value.toLowerCase();
    // console.log("Input Event fired", inputValue);

    let noteCards = document.getElementsByClassName('noteCardContainer');
    Array.from(noteCards).forEach(function (element) {
        let cardTextElement = element.getElementsByTagName('p')[0];
        let cardText = cardTextElement.textContent.toLowerCase();
        if (cardText.includes(inputValue)) {
            element.style.display = 'block';
        }
        else {
            element.style.display = 'none';
        }
    });
})

/*
further Features:
1. Add Title
2. Mark a note as Important
3. Separate notes per user
4. Sync and host to web server

Jumbotron bg-color - #e9ecef
*/

// add to Important 
function addToImp(noteIndex, buttonId) {
    // console.log("marking",noteIndex, "as important");

    let buttonElement = document.getElementById(buttonId);
    // buttonElement.classList.toggle("btn-primary", "btn-outline-primary");

    let keyOfNotes = "notesOf" + nameOfUser;
    let notes = localStorage.getItem(keyOfNotes);
    notesObj = JSON.parse(notes);

    let currentNoteObj = notesObj[noteIndex]
    if (currentNoteObj.isImportant) {
        currentNoteObj.isImportant = false;
        buttonElement.textContent = "Mark";
        buttonElement.classList.add('btn-outline-primary');
        buttonElement.classList.remove('btn-primary');
    } else {
        currentNoteObj.isImportant = true;
        buttonElement.classList.add("btn-primary");
        buttonElement.classList.remove('btn-outline-primary');
        buttonElement.textContent = "Unmark";
    }

    localStorage.setItem(keyOfNotes, JSON.stringify(notesObj));
}

// Mode
function lightMode() {
    document.body.style.backgroundColor = "white";

    let notesHeading = document.getElementById('notesHeading');
    notesHeading.style.color = "black";

    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function (element) {
        element.style.backgroundColor = "#e9ecef";
    });

    let noteCardsText = document.getElementsByClassName('note-text');
    Array.from(noteCardsText).forEach(function (element) {
        element.style.color = "black";
    });
}

function darkMode() {
    // document.body.style.backgroundColor = "#121212";
    // document.body.style.backgroundColor = " #2d2d2d";
    document.body.style.backgroundColor = "#ababab";

    let notesHeading = document.getElementById('notesHeading');
    notesHeading.style.color = "white";

    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function (element) {
        // element.style.backgroundColor = "#ababab";
        element.style.backgroundColor = "#121212";
    });

    let noteCardsText = document.getElementsByClassName('note-text');
    Array.from(noteCardsText).forEach(function (element) {
        element.style.color = "#ffffff";
    });

    // let addNoteContainer = document.getElementsByClassName('jumbotron')[0];
    // addNoteContainer.style.backgroundColor = "#121212";
}
