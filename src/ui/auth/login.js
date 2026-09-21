import "../../css/style.css";

import { createApiKey, loginUser } from "../../api/auth.js";
import { loadApiKey, saveApiKey, saveSession } from "../../utils/storages.js";

document.querySelector("#app").innerHTML = `
<main class="login-container">
      <h1>COMMONS</h1>
      <form class="login-form" action="../../js/ui/auth/login.js" method="POST">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit" id="login-btn">LOGIN</button>
        <div id="login-error" class="error-message"></div>
      </form>
      <p>New here? <a href="register.html">Register</a></p>
</main>
`;

const form = document.querySelector(".login-form");

const errorMessage = document.querySelector("#login-error");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");

  const credentials = {
    email,
    password,
  };

  try {
    const response = await loginUser(credentials);
    saveSession(response.data.accessToken, {
      id: response.data.name,
      username: response.data.name,
      email: response.data.email,
    });

    if (!loadApiKey()) {
      try {
        const apiKeyResponse = await createApiKey();
        saveApiKey(apiKeyResponse.data.key);
      } catch (apiKeyError) {
        console.warn("Unable to create an API key after login.", apiKeyError);
      }
    }

    // Redirect to the feed page after successful login
    alert("Login successful!");
    window.location.assign("../feed/index.html");
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message);
    }
  }
});
