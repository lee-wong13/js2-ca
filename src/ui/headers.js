import { getProfile } from "../api/profile.js";
import { clearSession, loadProfile } from "../utils/storages.js";

export function renderHeader() {
  const profile = loadProfile();
  const header = document.createElement("header");
  header.className = "site-header";

  const homeLink = document.createElement("a");
  homeLink.className = "site-header__brand";
  homeLink.href = `${import.meta.env.BASE_URL}pages/feed/index.html`;
  homeLink.textContent = "COMMONS";

  const userMenu = document.createElement("div");
  userMenu.className = "site-header__user-menu";

  const userButton = document.createElement("button");
  userButton.className = "site-header__user";
  userButton.type = "button";
  userButton.setAttribute("aria-expanded", "false");
  userButton.setAttribute("aria-label", "Open profile menu");

  const name = profile?.username ?? "Guest";
  const avatar = document.createElement("img");
  avatar.className = "site-header__avatar";
  avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=3f5b4a&color=ffffff`;
  avatar.alt = `${name} profile picture`;

  if (profile?.username) {
    void getProfile(profile.username)
      .then((userProfile) => {
        if (userProfile.avatar?.url) {
          avatar.src = userProfile.avatar.url;
          avatar.alt = userProfile.avatar.alt || `${name} profile picture`;
        }
      })
      .catch(() => undefined);
  }

  const userName = document.createElement("span");
  userName.textContent = name;

  const menu = document.createElement("div");
  menu.className = "site-header__menu";

  const profileLink = document.createElement("a");
  profileLink.href = `${import.meta.env.BASE_URL}pages/profile/index.html`;
  profileLink.textContent = "View profile";

  // Logout button for ending the user session
  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.textContent = "Logout";
  logoutButton.addEventListener("click", () => {
    clearSession();
    window.location.assign(`${import.meta.env.BASE_URL}pages/auth/login.html`);
  });

  menu.append(profileLink, logoutButton);
  userButton.append(avatar, userName);
  userMenu.append(userButton, menu);
  userButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menu.classList.toggle("is-open");
    userButton.setAttribute("aria-expanded", String(isOpen));
  });
  menu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => {
    menu.classList.remove("is-open");
    userButton.setAttribute("aria-expanded", "false");
  });

  header.append(homeLink, userMenu);
  return header;
}
