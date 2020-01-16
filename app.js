class Book{
    constructor(title, author, genre, isbn){
        this.title=title;
        this.author=author;
        this.genre=genre;
        this.isbn=isbn
    }
}

class UI{
    static displayBooks(){
        const books=Store.getBooks();
        books.forEach((book)=>UI.addBookToList(book));
    }

    static addBookToList(book){
        const list=document.querySelector('#book-list');

        const row=document.createElement('tr');
        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(ele){
        if(ele.classList.contains('delete')){
            ele.parentElement.parentElement.remove();
        }
    }

    static showAlert(msg, className){
        const div=document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        const container=document.querySelector('.container');
        const form=document.querySelector('#book-form');
        container.insertBefore(div,form);
        // vanish in 3 sec
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#genre').value='';
        document.querySelector('#isbn').value='';
    }
}

//Store Class: Handles storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books=Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books=Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit',(e)=>{
    //prevent actual submit
    e.preventDefault();

    //Get form values
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const genre=document.querySelector('#genre').value;
    const isbn=document.querySelector('#isbn').value;


    //validate
    if(title===''||author===''||genre===''||isbn===''){
        UI.showAlert('Please fill in all fields.', 'danger');
    }else{
        //Instantiate a Book
        const book=new Book(title, author, genre, isbn);
        //Add book to UI
        UI.addBookToList(book);

        // Add Book to Store
        Store.addBook(book);
        
        //Show success msg
        UI.showAlert('Book Added.', 'success');

        //Clear Fields
        UI.clearFields(); 
    }

});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    //Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //Show success message
    UI.showAlert('Book Removed.', 'success');
});