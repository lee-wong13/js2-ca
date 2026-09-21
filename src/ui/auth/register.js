import "../../css/style.css";

import { registerUser } from "../../api/auth.js";

document.querySelector("#app").innerHTML = `
<main class="register-container">
      <h1>COMMONS</h1>
      <form class="register-form" action="javascript:void(0);" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <div id="username-error" class="error-message"></div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" pattern=".*@stud.noroff.no" title="Use your @stud.noroff.no email address" required />
        <div id="email-error" class="error-message">! Invalid Email</div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <div id="password-error" class="error-message">
          ! Password must be at least 8 characters long and contain at least one
          uppercase letter, one lowercase letter, and one number
        </div>
        <button type="submit" id="register-btn">REGISTER</button>
        <div id="register-error" class="error-message"></div>
      </form>
      <p>Already have an account? <a href="login.html">Login</a></p>
    </main>
    `;

const form = document.querySelector(".register-form");
const errorMessage = document.querySelector("#register-error");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const formData = new FormData(form);

  const name = formData.get("username").trim();
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");

  if (!email.endsWith("@stud.noroff.no")) {
    showError("Use your @stud.noroff.no email address");
    return;
  }

  if (name.length < 3) {
    showError("Username must be at least 3 characters long");
    return;
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    showError(
      "Password must be at least 8 characters and contain uppercase, lowercase, and a number",
    );
    return;
  }

  const userData = {
    name,
    email,
    password,
  };

  try {
    await registerUser(userData);
    alert("Registration successful!");
    window.location.assign("login.html");
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message);
    }
  }
});
