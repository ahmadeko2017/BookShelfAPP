const bookSubmit = document.getElementById('bookSubmit');
const searchInput = document.getElementById('searchBookTitle');
const modalClose = document.getElementById('modalClose');

const isDuplicate = (title) => {
    let flag = false;
    let books = JSON.parse(localStorage.getItem('books'));
    try {
        books.forEach(item => {if(item.title.toLowerCase() === title.toLowerCase()){
            flag = true;
        }})
    } catch (error) {
        console.log("data pertama kali dibuat")
    }
    return flag;
}

const addBookToLocalStorage = (book) => {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

const addBookToList = (book) => {
    const incompleteBook = document.getElementById('incompleteBookshelfList');
    const completeBook = document.getElementById('completeBookshelfList');
    const bookItem = document.createElement('div');
    bookItem.classList.add('card');
    bookItem.classList.add('book_item');
    bookItem.classList.add('m-2');
    bookItem.id = book.id;
    bookItem.innerHTML = 
    `
    <div class="card-body">
        <div class="card-title d-flex align-items-start justify-content-between">
            <h3>${book.title}</h3>
            <div class="dropdown">
                <button
                class="btn p-0"
                type="button"
                id="cardOpt3"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                >
                <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                    <a class="dropdown-item toggle-read-btn">${!book.isComplete? 'selesai dibaca' : 'belum dibaca'}</a>
                    <a class="dropdown-item delete-btn">Hapus buku</a>
                </div>
            </div>
        </div>
        <table>
            <tr>
                <th>Penulis</th>
                <td>: ${book.author}</td>
            </tr>
            <tr>
                <th>Tahun</th>
                <td>: ${book.year}</td>
            </tr>
        </table> 
    </div>
    `;

    if (book.isComplete === false){
        incompleteBook.appendChild(bookItem);
    } else {
        completeBook.appendChild(bookItem);
    }

    const deleteBtn = bookItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda tidak akan dapat mengembalikan buku ini!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteBookFromLocalStorage(book);
                bookItem.remove();
              Swal.fire(
                'Terhapus!',
                'Buku telah berhasil dihapus.',
                'success'
              );
            }
        });
    })

    const toggleReadBtn = bookItem.querySelector('.toggle-read-btn');
    toggleReadBtn.addEventListener('click', (e) => {
        book.isComplete = !book.isComplete;
        updateStatusBookInLocalStorage(book);
        incompleteBook.innerHTML = '';
        completeBook.innerHTML = '';
        displayBooksFromLocalStorage();
    });
}

const displayBooksFromLocalStorage = () => {
    let books = JSON.parse(localStorage.getItem('books'));
    if (books == null) {
        books = [];
    } 
    books.forEach(book => {
        addBookToList(book);
    });
}

const deleteBookFromLocalStorage = (book) => {
    let books = JSON.parse(localStorage.getItem('books'));
    books = books.filter(item => item.title != book.title);
    localStorage.setItem('books', JSON.stringify(books));
}

const updateStatusBookInLocalStorage = (book) => {
    let books = JSON.parse(localStorage.getItem('books'));
    books = books.map(item => {
        if (item.title === book.title){
            item.isComplete = book.isComplete;
        }
        return item;
    });
    localStorage.setItem('books', JSON.stringify(books));
}

const searchBooks = (query) => {
    const bookItems = document.querySelectorAll('.book_item');
    bookItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    })
}

bookSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const book = {
        id: new Date()/1,
        title: title, 
        author: author, 
        year: year, 
        isComplete: isComplete
    }

    if (!isDuplicate(title) || localStorage.getItem('books') == null){
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda tidak akan dapat mengubah data buku kembali!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Tambahkan!',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
                // menambahkan buku ke local storage
                addBookToLocalStorage(book);

                // menamilkan buku pada daftar
                addBookToList(book);
                Swal.fire(
                    'Ditambahkan!',
                    'Buku telah berhasil ditambahkan.',
                    'success'
              );
            }
        });
    } else {
        Swal.fire('anda memasukkan data duplikat');
    }

});

searchInput.addEventListener("input", function () {
    searchBooks(searchInput.value);
});

displayBooksFromLocalStorage();