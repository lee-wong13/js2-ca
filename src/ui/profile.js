// Profile page script
// Handles the profile page functionality, including displaying user information, posts, and managing follow/unfollow actions.

import "../css/style.css";
import {
  followUser,
  getProfile,
  unfollowUser,
  updateProfile,
} from "../api/profile.js";
import { renderHeader } from "./headers.js";
import { loadProfile } from "../utils/storages.js";
import { renderPostCard } from "../utils/render.js";
import fallbackBanner from "../assets/hero.png";
import { authGuard } from "../utils/auth-guard.js";

// Ensure the user is authenticated before accessing the profile page.
authGuard();

// Select the main app container and render the header and profile page structure.
const app = document.querySelector("#app");
app.append(renderHeader());
app.insertAdjacentHTML(
  "beforeend",
  `
<main class="profile-container profile-page">
  <div class="profile-banner">
    <img id="profile-banner-image" src="${fallbackBanner}" alt="" />
  </div>
  <section class="profile-header">
    <img class="profile-avatar" id="profile-avatar" alt="" />
    <div class="profile-info">
      <h1 id="username">Loading profile...</h1>
      <div id="profile-stats" class="profile-stats">
        <span id="posts-count"></span>
        <button id="followers-count" type="button"></button>
        <button id="following-count" type="button"></button>
      </div>
      <p id="bio"></p>
      <div class="profile-actions">
        <button id="follow-btn" type="button">FOLLOW</button>
        <button id="unfollow-btn" type="button">UNFOLLOW</button>
        <button id="edit-profile-btn" type="button">EDIT PROFILE</button>
      </div>
      <p id="follow-error" class="error-message"></p>
    </div>
  </section>
  <section id="profile-posts">
    <h2 class="profile-posts-title">Posts</h2>
    <div id="profile-post-list"><p>Loading posts...</p></div>
  </section>
</main>
`,
);

// Extract the username from the URL or use the logged-in user's username as a fallback.
// if the URL contains a "name" parameter, use it; otherwise, fall back to the logged-in user's username.
const username =
  new URLSearchParams(window.location.search).get("name") ??
  loadProfile()?.username;

// Select profile elements from the DOM.
const profileName = document.querySelector("#username");
const profileBio = document.querySelector("#bio");
const profileStats = document.querySelector("#profile-stats");
const postsCountLabel = document.querySelector("#posts-count");
const followersCountButton = document.querySelector("#followers-count");
const followingCountButton = document.querySelector("#following-count");
const profileAvatar = document.querySelector("#profile-avatar");
const profileBanner = document.querySelector("#profile-banner-image");
const profilePosts = document.querySelector("#profile-post-list");
const followButton = document.querySelector("#follow-btn");
const unfollowButton = document.querySelector("#unfollow-btn");
const editProfileButton = document.querySelector("#edit-profile-btn");
const followError = document.querySelector("#follow-error");

// Helper function to generate avatar URLs, using a default service if no custom URL is provided.
function avatarUrl(name, url) {
  return (
    url ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3f5b4a&color=ffffff`
  );
}

// Function to open the modal displaying a list of people (followers/following).
// It creates an overlay with a searchable list of users and handles rendering based on the search query.
function openPeopleModal(title, people) {
  // Build an overlay and accessible dialog for the followers/following list.
  const overlay = document.createElement("div");
  overlay.className = "people-modal-overlay";
  const modal = document.createElement("section");
  modal.className = "people-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const heading = document.createElement("div");
  heading.className = "people-modal__heading";
  const headingText = document.createElement("h2");
  headingText.textContent = title;
  const closeButton = document.createElement("button");
  closeButton.className = "people-modal__close";
  closeButton.type = "button";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Close");
  heading.append(headingText, closeButton);
  const search = document.createElement("input");
  search.className = "people-modal__search";
  search.type = "search";
  search.placeholder = "Search";
  const list = document.createElement("div");
  list.className = "people-modal__list";
  const renderPeople = (query = "") => {
    // Re-render the list to show only names matching the current search text.
    const matches = people.filter((person) =>
      person.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    list.replaceChildren(
      ...(matches.length > 0
        ? matches.map((person) => {
            const link = document.createElement("a");
            link.className = "people-modal__person";
            link.href = `./index.html?name=${encodeURIComponent(person.name)}`;
            const avatar = document.createElement("img");
            avatar.src = avatarUrl(person.name, person.avatar?.url);
            avatar.alt = `${person.name} profile picture`;
            const name = document.createElement("span");
            name.textContent = person.name;
            link.append(avatar, name);
            return link;
          })
        : [document.createTextNode("No users found.")]),
    );
  };
  const closeModal = () => overlay.remove();

  // Support searching and close the dialog from its button or the backdrop.
  search.addEventListener("input", () => renderPeople(search.value));
  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });
  renderPeople();

  // Add the finished dialog to the page and focus its search field.
  modal.append(heading, search, list);
  overlay.append(modal);
  document.body.append(overlay);
  search.focus();
}

// Function to render the edit profile modal
function renderEditProfileModal(profile) {
  if (document.querySelector("#edit-profile-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "edit-profile-overlay";
  overlay.className = "people-modal-overlay";
  overlay.innerHTML = `
    <section class="people-modal edit-profile-modal" role="dialog" aria-modal="true" aria-label="Edit profile">
      <div class="people-modal__heading">
        <h2>Edit Profile</h2>
        <button type="button" class="people-modal__close" id="close-profile-edit" aria-label="Close">×</button>
      </div>
      <form id="edit-profile-form" class="edit-profile-form">
        <label for="edit-bio">Bio</label>
        <textarea id="edit-bio" name="bio" maxlength="160"></textarea>
        <label for="edit-avatar">Avatar URL</label>
        <input id="edit-avatar" name="avatar" type="url" />
        <label for="edit-banner">Banner URL</label>
        <input id="edit-banner" name="banner" type="url" />
        <p id="edit-profile-error" class="error-message"></p>
        <div class="edit-profile-form__actions">
          <button type="submit">SAVE</button>
          <button type="button" id="cancel-profile-edit">CANCEL</button>
        </div>
      </form>
    </section>
  `;
  document.body.append(overlay);
  const form = overlay.querySelector("#edit-profile-form");
  const bioInput = overlay.querySelector("#edit-bio");
  const avatarInput = overlay.querySelector("#edit-avatar");
  const bannerInput = overlay.querySelector("#edit-banner");
  const errorMessage = overlay.querySelector("#edit-profile-error");
  if (!form || !bioInput || !avatarInput || !bannerInput || !errorMessage)
    return;
  bioInput.value = profile.bio ?? "";
  avatarInput.value = profile.avatar?.url ?? "";
  bannerInput.value = profile.banner?.url ?? "";
  const closeModal = () => overlay.remove();
  overlay
    .querySelector("#cancel-profile-edit")
    ?.addEventListener("click", closeModal);
  overlay
    .querySelector("#close-profile-edit")
    ?.addEventListener("click", closeModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const profileData = {
      bio: String(data.get("bio")).trim(),
    };
    const avatar = String(data.get("avatar")).trim();
    const banner = String(data.get("banner")).trim();
    if (avatar)
      profileData.avatar = {
        url: avatar,
        alt: `${profile.name} profile picture`,
      };
    if (banner)
      profileData.banner = {
        url: banner,
        alt: `${profile.name} profile banner`,
      };
    const saveButton = form.querySelector("[type=submit]");
    if (saveButton) saveButton.disabled = true;
    try {
      await updateProfile(profile.name, profileData);
      window.location.reload();
    } catch (error) {
      errorMessage.textContent =
        error instanceof Error ? error.message : "Failed to update profile.";
      errorMessage.style.display = "block";
      if (saveButton) saveButton.disabled = false;
    }
  });
}

// Function to render the follow/unfollow button state based on whether the logged-in user is following the profile.
function renderFollowState(isFollowing) {
  if (!followButton || !unfollowButton) return;
  followButton.hidden = isFollowing;
  unfollowButton.hidden = !isFollowing;
}
// Function to render the profile information and posts on the profile page.

async function renderProfile() {
  if (
    !profileName ||
    !profileBio ||
    !profileStats ||
    !profileAvatar ||
    !profileBanner ||
    !profilePosts
  )
    return; // Return early if any of the essential profile elements are missing.
  if (!username) {
    profileName.textContent = "No profile selected.";
    profilePosts.textContent = "Log in to view your profile.";
    return; // Return early if no username is available, prompting the user to log in.
  }
  try {
    const profile = await getProfile(username);
    document.title = `COMMONS - ${profile.name}`;
    const counts = profile._count;
    const loggedInUsername = loadProfile()?.username;
    const isOwnProfile =
      loggedInUsername?.toLowerCase() === profile.name.toLowerCase();
    let followers = counts?.followers ?? 0;
    let isFollowing = false;
    const followingCount = counts?.following ?? 0;
    const postsCount = counts?.posts ?? profile.posts?.length ?? 0;
    const followersList = profile.followers ?? [];
    const followingList = profile.following ?? [];

    // Checks if the logged-in user is following the profile.
    if (!isOwnProfile && loggedInUsername) {
      const loggedInProfile = await getProfile(loggedInUsername);
      isFollowing =
        loggedInProfile.following?.some(
          (person) => person.name.toLowerCase() === profile.name.toLowerCase(),
        ) ?? false;
    }
    profileName.textContent = profile.name;
    profileBio.textContent = profile.bio || "No bio yet.";
    postsCountLabel.textContent = `${postsCount} posts`;
    followersCountButton.textContent = `${followers} followers`;
    followingCountButton.textContent = `${followingCount} following`;
    profileAvatar.src = avatarUrl(profile.name, profile.avatar?.url);
    profileAvatar.alt = `${profile.name} profile picture`;
    profileBanner.src = profile.banner?.url ?? fallbackBanner;
    profileBanner.alt = profile.banner?.alt ?? `${profile.name} profile banner`;

    //Show user's posts on the profile page.
    const posts = (profile.posts ?? []).map((post) => ({
      ...post,
      author: post.author ?? { name: profile.name, avatar: profile.avatar },
    }));

    // Render the user's posts or a message indicating no posts are available.
    profilePosts.replaceChildren(
      ...(posts.length > 0
        ? posts.map(renderPostCard)
        : [document.createTextNode("This user has no posts yet.")]),
    );
    followButton?.toggleAttribute("hidden", isOwnProfile);
    unfollowButton?.toggleAttribute("hidden", isOwnProfile);
    editProfileButton?.toggleAttribute("hidden", !isOwnProfile);

    if (!isOwnProfile) renderFollowState(isFollowing);
    editProfileButton?.addEventListener("click", () =>
      renderEditProfileModal(profile),
    );
    followersCountButton?.addEventListener("click", () =>
      openPeopleModal("Followers", followersList),
    );
    followingCountButton?.addEventListener("click", () =>
      openPeopleModal("Following", followingList),
    );

    // Add event listener for the follow button click.
    followButton?.addEventListener("click", async () => {
      if (!username || isFollowing) return;
      followButton.disabled = true;
      try {
        await followUser(username);
        isFollowing = true;
        followers += 1;
        followersCountButton.textContent = `${followers} followers`;
        renderFollowState(isFollowing);
      } catch (error) {
        if (followError) {
          followError.textContent =
            error instanceof Error
              ? error.message
              : "Failed to follow profile.";
          followError.style.display = "block";
        }
      } finally {
        followButton.disabled = false;
      }
    });
    // Add event listener for the unfollow button click.
    unfollowButton?.addEventListener("click", async () => {
      if (!username || !isFollowing) return;
      unfollowButton.disabled = true;
      try {
        await unfollowUser(username);
        isFollowing = false;
        followers = Math.max(0, followers - 1);
        followersCountButton.textContent = `${followers} followers`;
        renderFollowState(isFollowing);
      } catch (error) {
        if (followError) {
          followError.textContent =
            error instanceof Error
              ? error.message
              : "Failed to unfollow profile.";
          followError.style.display = "block";
        }
      } finally {
        unfollowButton.disabled = false;
      }
    });
  } catch (error) {
    //handling any api failure and show a readable message to the user.
    profileName.textContent = "Unable to load profile";
    profilePosts.textContent =
      error instanceof Error ? error.message : "Failed to load profile.";
  }
}

void renderProfile();
