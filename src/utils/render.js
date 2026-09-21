// Utility functions for rendering posts and related elements

import { deletePost } from "../api/posts.js";
import { loadProfile } from "./storages.js";

// Renders a single post card element with actions and metadata
export function renderPostCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";
  article.tabIndex = 0;
  article.setAttribute("aria-label", `Open post: ${post.title}`);

  const openPost = () => {
    window.location.assign(`/pages/post/index.html?id=${post.id}`);
  };

  article.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest("a, button")) {
      openPost();
    }
  });

  article.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target.closest("a, button")) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPost();
    }
  });

  // Extract and store the day of the post creation date for potential use in styling or sorting

  const day = post.created ? new Date(post.created).getDate() : null;
  if (day !== null) {
    article.dataset.day = String(day);
  }

  const authorName = post.author?.name ?? "Unknown author";
  const loggedInUser = loadProfile()?.username;
  const isOwnPost = loggedInUser?.toLowerCase() === authorName.toLowerCase();

  const menu = document.createElement("div");
  menu.className = "post-card-menu";

  const menuButton = document.createElement("button");
  menuButton.className = "post-card-menu__button";
  menuButton.type = "button";
  menuButton.textContent = "⋮";
  menuButton.setAttribute("aria-label", "Open post actions");
  menuButton.setAttribute("aria-expanded", "false");

  const menuContent = document.createElement("div");
  menuContent.className = "post-card-menu__content";

  // Conditionally render edit and delete options based on ownership of the post

  let deleteButton = null;

  if (isOwnPost) {
    const editLink = document.createElement("a");
    editLink.href = `/pages/post/index.html?id=${post.id}&edit=true`;
    editLink.textContent = "Edit post";

    deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete post";
    menuContent.append(editLink, deleteButton);
  } else {
    const profileLink = document.createElement("a");
    profileLink.href = `../profile/index.html?name=${encodeURIComponent(
      authorName,
    )}`;
    profileLink.textContent = "View profile";
    menuContent.append(profileLink);
  }

  menu.append(menuButton, menuContent);

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menuContent.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  menuContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    menuContent.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });

  deleteButton?.addEventListener("click", async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    deleteButton.disabled = true;

    try {
      await deletePost(post.id);
      article.remove();
    } catch (error) {
      deleteButton.disabled = false;
      window.alert(
        error instanceof Error ? error.message : "Failed to delete post.",
      );
    }
  });

  const title = document.createElement("h3");
  title.className = "post-title";

  const titleLink = document.createElement("a");
  titleLink.href = `/pages/post/index.html?id=${post.id}`;
  titleLink.textContent = post.title;
  title.append(titleLink);

  const content = document.createElement("p");
  content.textContent = post.body ?? "";

  const author = document.createElement("div");
  author.className = "author";

  const authorLink = document.createElement("a");
  authorLink.className = "author-link";
  authorLink.href = `../profile/index.html?name=${encodeURIComponent(
    authorName,
  )}`;

  const authorAvatar = document.createElement("img");
  authorAvatar.className = "author-avatar";
  authorAvatar.src =
    post.author?.avatar?.url ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      authorName,
    )}&background=3f5b4a&color=ffffff`;
  authorAvatar.alt = `${authorName} profile picture`;

  const authorLabel = document.createElement("span");
  authorLabel.textContent = `by ${authorName}`;
  authorLink.append(authorAvatar, authorLabel);
  author.append(authorLink);

  const date = document.createElement("p");
  date.className = "date";
  date.textContent = post.created
    ? new Date(post.created).toLocaleDateString()
    : "Date unavailable";

  article.append(menu, title, author, content);

  if (post.media?.url) {
    const imageWrapper = document.createElement("p");
    imageWrapper.className = "image";

    const image = document.createElement("img");
    image.src = post.media.url;
    image.alt = post.media.alt || post.title;
    imageWrapper.append(image);
    article.append(imageWrapper);
  }

  article.append(date);
  return article;
}
