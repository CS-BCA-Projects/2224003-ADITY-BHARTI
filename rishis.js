const mockBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      rating: 5,
      bookmarked: false,
      image:
        "https://readdy.ai/api/search-image?query=book cover design for The Great Gatsby with art deco style, golden geometric patterns on dark background, elegant and luxurious&width=400&height=600&seq=1&orientation=portrait",
    },
    {
      id: 2,
      title: "One Hundred Years of Solitude",
      author: "Gabriel García Márquez",
      rating: 5,
      bookmarked: false,
      image:
        "https://readdy.ai/api/search-image?query=book cover design for One Hundred Years of Solitude with magical realism elements, tropical colors, vintage style&width=400&height=600&seq=2&orientation=portrait",
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      rating: 5,
      bookmarked: false,
      image:
        "https://readdy.ai/api/search-image?query=book cover design for To Kill a Mockingbird with silhouette of children, tree branches, southern gothic style&width=400&height=600&seq=3&orientation=portrait",
    },
    {
      id: 4,
      title: "Of Human Bondage",
      author: "William Somerset Maugham",
      rating: 5,
      bookmarked: false,
      image:
        "https://readdy.ai/api/search-image?query=book cover design for Of Human Bondage with minimalist portrait, muted colors, classic literary style&width=400&height=600&seq=4&orientation=portrait",
    },
  ];
  // Handle bookmark toggle
  document
    .querySelectorAll(".text-gray-400.hover\\:text-primary")
    .forEach((button, index) => {
      button.addEventListener("click", function () {
        this.classList.toggle("text-primary");
        this.classList.toggle("text-gray-400");
        const icon = this.querySelector("i");
        if (icon.classList.contains("ri-bookmark-line")) {
          icon.classList.remove("ri-bookmark-line");
          icon.classList.add("ri-bookmark-fill");
          mockBooks[index].bookmarked = true;
          // Show success toast
          const toast = document.createElement("div");
          toast.className =
            "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0";
          toast.textContent = `${mockBooks[index].title} has been added to your bookmarks`;
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.classList.add("translate-y-full");
            setTimeout(() => toast.remove(), 300);
          }, 2000);
        } else {
          icon.classList.remove("ri-bookmark-fill");
          icon.classList.add("ri-bookmark-line");
          mockBooks[index].bookmarked = false;
        }
      });
    });
  // Handle category selection
  document.querySelectorAll(".category-scroll button").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".category-scroll button").forEach((btn) => {
        btn.classList.remove("bg-primary", "text-white");
        btn.classList.add("border", "border-gray-300", "hover:bg-gray-50");
      });
      this.classList.remove("border", "border-gray-300", "hover:bg-gray-50");
      this.classList.add("bg-primary", "text-white");
    });
  });
  // Handle search
  const searchInput = document.querySelector('input[type="text"]');
  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm),
    );
    // Update UI with filtered books
    const bookGrid = document.querySelector(".book-grid");
    if (searchTerm.length > 0 && filteredBooks.length === 0) {
      bookGrid.innerHTML = `
  <div class="col-span-full text-center py-8 text-gray-500">
  No books found matching "${searchTerm}"
  </div>
  `;
    }

    async function fetchBooks() {
      try {
          const response = await fetch("http://localhost:3000/books"); // Fetch books from backend
          
          if (!response.ok) {
              throw new Error("No books found");
          }
  
          const books = await response.json();
          console.log("Fetched Books:", books); // Debugging in console
  
          const bookListDiv = document.getElementById("book-list");
          bookListDiv.innerHTML = books.map(book => `
              <div>
                  <h2>${book.title}</h2>
                  <p><strong>Author:</strong> ${book.author}</p>
                  <p><strong>Genre:</strong> ${book.genre}</p>
                  <p><strong>Summary:</strong> ${book.summary}</p>
                  <p><a href="${book.text_url}" target="_blank">📖 Read Book</a></p>
                  ${book.audio_url ? `<p><a href="${book.audio_url}" target="_blank">🎧 Listen to Audiobook</a></p>` : ""}
                  <hr>
              </div>
          `).join("");
      } catch (error) {
          console.error("Error fetching books:", error);
          document.getElementById("book-list").innerHTML = "<p>No books available.</p>";
      }
  }
  
  // Call fetchBooks when the page loads
  window.onload = fetchBooks;
  
  });