// DOM elements
const noteCollection = document.querySelector('.note-collection')
const saveButton = document.querySelector('.form-save-button')
const searchButton = document.querySelector('.search-saved')
const editBtn = document.querySelector('.edit-btn')
const deleteBtn = document.querySelector('.delete-btn')

// Global array for all notes
let note_cards = JSON.parse(localStorage.getItem("notesData")) || [];

// function for designing note card
function DesignNoteCard(titleContent, bodyContent) {
    // note card
    const parentDiv = document.createElement('div');
    parentDiv.className = 'note'

    // title inside the note card
    const noteTitle = document.createElement('div')
    noteTitle.className = 'note-title'
    const h3 = document.createElement('h3')
    h3.textContent = titleContent;

    // edit and delete buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'note-card-buttons'

    const editButton = document.createElement('button')
    editButton.className = 'edit-btn'
    const editBtnImg = document.createElement("img")
    editBtnImg.src = "./assets/pen-to-square-solid.svg"
    editBtnImg.className = "edit-btn"
    editButton.appendChild(editBtnImg)

    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-btn'
    const deleteBtnImg = document.createElement("img")
    deleteBtnImg.src = "./assets/trash-solid.svg"
    deleteBtnImg.className = "delete-btn"
    deleteButton.appendChild(deleteBtnImg)

    buttonContainer.append(editButton, deleteButton)

    // content inside the note
    const noteContent = document.createElement('div')
    noteContent.className = 'note-content'
    const p = document.createElement('p')
    p.textContent = bodyContent

    noteTitle.append(h3, buttonContainer)
    noteContent.appendChild(p)
    parentDiv.append(noteTitle, noteContent)

    return parentDiv
}

// Initial load: display notes from local storage
function loadNotes() {
    noteCollection.innerHTML = ""
    note_cards.forEach((note) => {
        noteCollection.appendChild(DesignNoteCard(note.title, note.content))
    })
}
loadNotes() // Display saved notes on page load

// display the note card once created
saveButton.addEventListener('click', (e) => {

    e.preventDefault()

    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();

    if (title === "" || content === "") {
        alert('Title/Content Missing')
    }
    else {
        const newNote = { title, content }
        note_cards.push(newNote)
        // store newly created note in local storage
        localStorage.setItem("notesData", JSON.stringify(note_cards))
        noteCollection.appendChild(DesignNoteCard(title, content))
    }

    // Clear the input fields
    document.querySelector('#title').value = ""
    document.querySelector("#content").value = ""
})


// search to find your note
searchButton.addEventListener('click', () => {
    // grab the search input text
    const userSearch = document.querySelector("#note-search").value.trim().toLowerCase()
    const result = note_cards.filter((card) => card.title.toLowerCase().includes(userSearch))

    noteCollection.innerHTML = "";
    if (result.length == 0) {
        noteCollection.innerHTML = "<p>No such note found!</p>"
    }
    else {
        result.forEach((card) => {
            noteCollection.appendChild(DesignNoteCard(card.title, card.content))
        })
    }
})

// edit/delete notes
noteCollection.addEventListener("click", (e) => {
    console.log(e.target.tagName)
    // edit button functionality
    if (e.target.className == 'edit-btn') {

        const closestNoteCard = e.target.closest('.note') // access the nearest element whose className is '.note'

        // access the title and content of that closest note card
        const title = closestNoteCard.querySelector(".note-title h3").textContent
        const content = closestNoteCard.querySelector(".note-content p").textContent

        // put the title and content in form fields
        document.querySelector('#title').value = title
        document.querySelector('#content').value = content

        // remove the note from array and local storage 

        // basically filter out those note cards that not currently being edited and store only these on localstorage and note_cards array.
        note_cards = note_cards.filter((note) => !(note.title == title && note.content == content)) // those whose title and content doesn't match with selected note card for editing
        localStorage.setItem("notesData", JSON.stringify(note_cards))

        // re-render
        loadNotes()
    }

    // delete button functionality
    if (e.target.className == 'delete-btn') {

        const overlay = document.createElement("div")
        overlay.className = "delete-overlay"

        const deletePopup = document.createElement("div")
        deletePopup.className = "delete-popup"

        const deletePopupPara = document.createElement("div")
        deletePopupPara.className = "dlt-ppup-para"
        const p = document.createElement("p")
        p.textContent = "Are you sure you want to delete this note?"
        p.id = "dlt-ppup-p"
        deletePopupPara.appendChild(p)

        const deletePopupBtns = document.createElement("div")
        deletePopupBtns.className = "dlt-ppup-btns"
        const cancelBtn = document.createElement("button")
        cancelBtn.id = "dlt-ppup-cancel-btn"
        cancelBtn.innerHTML = "Cancel"
        const deleteBtn = document.createElement("button")
        deleteBtn.id = "dlt-ppup-delete-btn"
        deleteBtn.innerHTML = "Delete"
        deletePopupBtns.append(cancelBtn, deleteBtn)

        deletePopup.append(deletePopupPara, deletePopupBtns);
        // when delete button is clicked a popup should appear to confirm the note deletion.
        overlay.appendChild(deletePopup)
        document.body.appendChild(overlay)

        // Position popup at center of screen — optional if you want near note
        deletePopup.style.top = `${e.clientY}px`; // You can tweak this for better alignment
        deletePopup.style.left = `${e.clientX}px`;
        // deletePopup.style.display = "flex"

        overlay.addEventListener("click", (event) => {

            const choosed = event.target.id;

            if (choosed == "dlt-ppup-cancel-btn" || event.target == overlay) {
                overlay.remove()
            }
            else if (choosed == "dlt-ppup-delete-btn") {
                const closestNoteCard = e.target.closest('.note')
                const title = closestNoteCard.querySelector(".note-title h3").textContent
                const content = closestNoteCard.querySelector(".note-content p").textContent

                // remove the note from the array
                note_cards = note_cards.filter((note) => !(note.title == title && note.content == content))
                localStorage.setItem("notesData", JSON.stringify(note_cards))

                loadNotes()
                overlay.remove()
            }
        })
    }
})