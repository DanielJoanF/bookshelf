document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  let books = [];

  const saveToLocalStorage = () => localStorage.setItem("books", JSON.stringify(books));

  const loadFromLocalStorage = () => {
      const storedBooks = localStorage.getItem("books");
      if (storedBooks) {
          books = JSON.parse(storedBooks);
          renderBooks();
      }
  };

  const createBookElement = (book) => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("book-item");
      bookElement.setAttribute("data-bookid", book.id);
      bookElement.setAttribute("data-testid", "bookItem");
      
      bookElement.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div class="button-group">
              <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum Selesai" : "Selesai Dibaca"}</button>
              <button data-testid="bookItemDeleteButton">Hapus Buku</button>
              <button data-testid="bookItemEditButton">Edit Buku</button>
          </div>
      `;

      bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => toggleBookStatus(book.id));
      bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => deleteBook(book.id));
      bookElement.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => editBook(book.id));

      return bookElement;
  };

  const renderBooks = () => {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      books.forEach((book) => {
          const bookElement = createBookElement(book);
          book.isComplete ? completeBookList.appendChild(bookElement) : incompleteBookList.appendChild(bookElement);
      });
  };

  const addBook = (title, author, year, isComplete) => {
      books.push({ id: Date.now().toString(), title, author, year, isComplete });
      saveToLocalStorage();
      renderBooks();
  };

  const toggleBookStatus = (bookId) => {
      const book = books.find(b => b.id === bookId);
      if (book) {
          book.isComplete = !book.isComplete;
          saveToLocalStorage();
          renderBooks();
      }
  };

  const deleteBook = (bookId) => {
      books = books.filter(b => b.id !== bookId);
      saveToLocalStorage();
      renderBooks();
  };

  const editBook = (bookId) => {
      const book = books.find(b => b.id === bookId);
      if (book) {
          const newTitle = prompt("Masukkan judul baru:", book.title);
          const newAuthor = prompt("Masukkan penulis baru:", book.author);
          const newYear = parseInt(prompt("Masukkan tahun rilis baru:", book.year));
          
          if (newTitle && newAuthor && newYear) {
              Object.assign(book, { title: newTitle, author: newAuthor, year: newYear });
              saveToLocalStorage();
              renderBooks();
          }
      }
  };

  const searchBook = (keyword) => {
      const filteredBooks = books.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()));
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      filteredBooks.forEach(book => {
          const bookElement = createBookElement(book);
          book.isComplete ? completeBookList.appendChild(bookElement) : incompleteBookList.appendChild(bookElement);
      });
  };

  bookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addBook(
          document.getElementById("bookFormTitle").value,
          document.getElementById("bookFormAuthor").value,
          parseInt(document.getElementById("bookFormYear").value),
          document.getElementById("bookFormIsComplete").checked
      );
      bookForm.reset();
  });

  searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      searchBook(document.getElementById("searchBookTitle").value);
  });

  loadFromLocalStorage();
});
