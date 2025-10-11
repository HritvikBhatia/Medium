let blogs = {
  blog1: { likes: 0, bookmarked: false },
  blog2: { likes: 0, bookmarked: false },
  blog3: { likes: 0, bookmarked: false }
};

document.addEventListener("DOMContentLoaded", function() {

  Object.keys(blogs).forEach(blogId => {
    const blog = blogs[blogId];
    const blogEl = document.getElementById(blogId);

    const likeBtn = blogEl.querySelector(".like-btn");
    const bookmarkBtn = blogEl.querySelector(".bookmark-btn");
    const shareBtn = blogEl.querySelector(".share-btn");
    const countEl = blogEl.querySelector(".like-count");

    // Like button - increment only, heart turns red
    likeBtn.addEventListener("click", function() {
      blog.likes += 1;
      countEl.textContent = blog.likes;
      likeBtn.classList.add("liked");
    });

    // Bookmark button - toggle color
    bookmarkBtn.addEventListener("click", function() {
      blog.bookmarked = !blog.bookmarked;
      if (blog.bookmarked) {
        bookmarkBtn.classList.add("bookmarked");
      } else {
        bookmarkBtn.classList.remove("bookmarked");
      }
    });

    // Share button - copies link
    shareBtn.addEventListener("click", function() {
      const blogURL = window.location.href + "#" + blogId;
      navigator.clipboard.writeText(blogURL)
        .then(() => alert("Blog link copied!"))
        .catch(() => alert("Failed to copy link"));
    });

  });

});
