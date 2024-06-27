// Récupération de l'élément du DOM
const booksTable = document.querySelector("#booksTable");

let bookOne = {
    title: "Les Forces du Mal : Une Guide de l'Auto-Défense",
    author: "Quentin Jentremble",
    nbOfPages: 352
}
let bookTwo = {
    title: "Le Manuel des Potions Avancées",
    author: "Arsenius Beaulitron",
    nbOfPages: 480
}
let bookThree = {
    title: "Vie et habitat des animaux fantastiques",
    author: " Norbert Dragonneau",
    nbOfPages: 324
}
let bookFour = {
    title: "Histoire de la Magie",
    author: "Bathilda Tourdesac",
    nbOfPages: 456
}
let listOfBooks = [bookOne, bookTwo, bookThree, bookFour];
displayListOfBooks();

function displayListOfBooks() {
    const tableOfBooks = document.querySelector("#booksTable tbody");
    let books = "";
    for (i = 0; i <= listOfBooks.length - 1; i++) {
        books += `<tr>
                    <td>${listOfBooks[i].title}</td>
                    <td>${listOfBooks[i].author}</td>
                    <td>${listOfBooks[i].nbOfPages}</td>
                    <td><button class="btn btn-warning" onClick="displayUpdateBookForm(${i})">Modifier</button></td>
                    <td><button class="btn btn-danger" onClick="deleteBook(${i})">Supprimer</button></td>
                </tr>`;
    }
    tableOfBooks.innerHTML = books;
}


function displayAddABook() {
    document.querySelector("#newBookForm").removeAttribute("class");
}

document.querySelector("#validationNewBookForm").addEventListener("click", function (event) {
    event.preventDefault();
    const bookTitle = document.querySelector("#newBookForm #bookTitle").value;
    const bookAuthor = document.querySelector("#newBookForm #bookAuthor").value;
    const bookNumberOfPages = document.querySelector("#newBookForm #bookNumberOfPages").value;
    addABook(bookTitle, bookAuthor, bookNumberOfPages);
    document.querySelector("#newBookForm").reset();
    document.querySelector("#newBookForm").className = "d-none";
})

function addABook(bookTitle, bookAuthor, bookNumberOfPages) {
    document.querySelector("#updateBookForm").className = "d-none";
    const newBook = {
        title: bookTitle,
        author: bookAuthor,
        nbOfPages: bookNumberOfPages
    }
    listOfBooks.push(newBook);
    displayListOfBooks();
}

function deleteBook(position) {
    if (confirm("Voulez-vous supprimer ce livre ?")) {
        listOfBooks.splice(position, 1);
        displayListOfBooks();
        alert("Suppression effectuée");
    } else {
        alert("Suppression annulée");
    }
}

function displayUpdateBookForm(position) {
    document.querySelector("#newBookForm").className = "d-none";
    document.querySelector("#updateBookForm").removeAttribute("class");
    document.querySelector("#updateBookForm #bookTitle").value = listOfBooks[position].title;
    document.querySelector("#updateBookForm #bookAuthor").value = listOfBooks[position].author;
    document.querySelector("#updateBookForm #bookNumberOfPages").value = listOfBooks[position].nbOfPages;
    document.querySelector("#updateBookForm #bookToUpdate").value = position;
}

document.querySelector("#confirmationUpdateBookForm").addEventListener("click", function (event) {
    event.preventDefault();
    let title = document.querySelector("#updateBookForm #bookTitle").value;
    let author = document.querySelector("#updateBookForm #bookAuthor").value;
    let numberOfPages = document.querySelector("#updateBookForm #bookNumberOfPages").value;
    let bookPosition = document.querySelector("#updateBookForm #bookToUpdate").value;

    listOfBooks[bookPosition].title = title;
    listOfBooks[bookPosition].author = author;
    listOfBooks[bookPosition].nbOfPages = numberOfPages;

    displayListOfBooks();
    document.querySelector("#updateBookForm").className = "d-none";
})
