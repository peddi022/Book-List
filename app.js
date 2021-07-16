//Book Class: Represents a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI tasks
class UI{
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list'); //fetches empty body for the list of books

        const row = document.createElement('tr'); //creates row

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove(); //el is the <a> tag element
        }
    }
 
    static showAlert(message, className){ 
        const div = document.createElement('div');
        div.className = `alert alert-${className}`; //assigns class name to the div that was created above
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class: Handles storage
class Store{
    static getBooks(){
        let books;
        if (localStorage.getItem('books') == null){
            books = []
        } else{ 
            books = JSON.parse(localStorage.getItem('books')); //JSON.parse converts text into JS object
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books)); //stringify converts JS object into string
                                                              //.setItem is creating a storage object with 'books' as key 
                                                              //  and JSON.stringify(books) as value
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn == isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books)); 
    }
}

//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks); //DOMContentLoaded event fires up 
                                                                //  when the initial HTML document is loaded

//Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault(); //what does this do?
  
    //Get form values
    const title = document.querySelector('#title').value; //.value is the value in the text field
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if (title == '' || author == '' || isbn == ''){
        UI.showAlert('Please fill in all fields', "danger");
    } else{
    //Instantiate book
    const book = new Book(title, author, isbn);

    //Add book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    //Success message
    UI.showAlert('Success!', "success");

    //Clear fields
    UI.clearFields();
    }
});

//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target) //.target event property returns the element that triggered the event 
                            //in this case, the element is 'X' in td with dummy # link

    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); //.textContent returns the text of its node 
                                                                                //.previousElementSibling gives the td with ISBN
                                                                                

    //Success message
    UI.showAlert('Book removed', "info");
});