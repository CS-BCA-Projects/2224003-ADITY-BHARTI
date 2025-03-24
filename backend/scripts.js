document.addEventListener("DOMContentLoaded", function () {
  
    const searchInput = document.getElementById("searchInput");
    const bookCards = document.querySelectorAll(".book-card");

    searchInput.addEventListener("input", function () {
        const searchQuery = searchInput.value.toLowerCase();
        bookCards.forEach((card) => {
            const title = card.querySelector("h2").textContent.toLowerCase();
            if (title.includes(searchQuery)) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    });

    // Tab Switching
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("highlight"));
            this.classList.add("highlight");
        });
    });

    // Audio Player Controls
    const playPauseBtn = document.getElementById("playPauseBtn");
    let isPlaying = true;

    playPauseBtn.addEventListener("click", function () {
        if (isPlaying) {
            playPauseBtn.textContent = "▶️";
        } else {
            playPauseBtn.textContent = "⏸️";
        }
        isPlaying = !isPlaying;
    });
    document.addEventListener("DOMContentLoaded", function () {
        const bookCards = document.querySelectorAll(".book-card");
        const modal = document.getElementById("bookModal");
        const modalTitle = document.getElementById("modalBookTitle");
        const modalAuthor = document.getElementById("modalBookAuthor");
        const modalDescription = document.getElementById("modalBookDescription");
        const modalImage = document.getElementById("modalBookImage");
        const closeModal = document.getElementById("closeModal");
    
        // Open Modal when clicking on a book
        bookCards.forEach((card) => {
            card.addEventListener("click", function () {
                modalTitle.textContent = card.dataset.title;
                modalAuthor.textContent = "By " + card.dataset.author;
                modalDescription.textContent = card.dataset.description;
                modalImage.src = card.dataset.image;
    
                modal.classList.remove("hidden");
            });
        });
    
        // Close Modal when clicking the close button
        closeModal.addEventListener("click", function () {
            modal.classList.add("hidden");
        });
    
        // Close Modal when clicking outside the modal
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.add("hidden");
            }
        });
    });
    
});
