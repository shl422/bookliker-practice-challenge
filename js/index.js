document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", function() {
	createList();
});

// APIS
API = { index, edit };

function index(url) {
	return fetch(url).then(response => response.json());
}

function edit(url, data) {
	return fetch(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	}).then(response => response.json());
}

// CONSTANTS
const baseURL = "http://localhost:3000/books/";
const list = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

//EVENT LISTENERS

// FUNCTIONS
function createList() {
	API.index(baseURL).then(bookList => {
		renderList(bookList);
		currentBooks = bookList;
	});
}

function renderList(bookList) {
	bookList.forEach(book => {
		let item = document.createElement("li");
		item.id = book.id;
		item.innerText = book.title;
		item.addEventListener("click", showBook);
		list.appendChild(item);
	});
}

function showBook(event) {
	let book = currentBooks.find(book => book.id == event.target.id);
	renderBook(book);
}

function renderBook(book) {
	!!document.querySelector(".display")
		? document.querySelector(".display").remove()
		: "do nothing";
	let display = document.createElement("div");
	display.className = "display";
	let h2 = document.createElement("h2");
	h2.className = "title";
	h2.innerText = book.title;
	let image = document.createElement("img");
	image.className = "thumbnail";
	image.src = book.img_url;
	let description = document.createElement("p");
	description.className = "description";
	description.innerText = book.description;
	let readers = document.createElement("h5");
	readers.innerText = "Readers";
	readers.addEventListener("click", toggleReadersDisplay);
	let users = document.createElement("ul");
	users.setAttribute("name", "users");
	users.className = "visible";
	book.users.forEach(user => {
		let item = document.createElement("li");
		item.innerText = user.username;
		users.appendChild(item);
	});
	let button = document.createElement("button");
	if (!!book.users.find(user => user.id == 1)) {
		button.className = "unread-button";
		button.innerText = "Unread Book";
	} else {
		button.className = "read-button";
		button.innerText = "Read Book";
	}
	button.id = book.id;
	button.addEventListener("click", readBook);
	display.append(h2, image, description, readers, users, button);
	showPanel.appendChild(display);
}

function readBook(event) {
	let book = currentBooks.find(book => book.id == event.target.id);
	let users = book.users;
	if (!!users.find(user => user.id == 1)) {
		users = users.filter(user => user.id != 1);
	} else {
		users.push({ id: 1, username: "pouros" });
	}
	API.edit(`${baseURL}${book.id}`, { users }).then(renderBook);
}

function toggleReadersDisplay() {
	let readersList = event.target.parentNode.childNodes[4];
	console.log(readersList.className);
	readersList.className == "visible"
		? (readersList.className = "hidden")
		: (readersList.className = "visible");
}
