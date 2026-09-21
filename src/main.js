import "../src/css/style.css";

document.querySelector("#app").innerHTML = `
<main class="container">
        <h1>COMMONS</h1>
        <p>
          Post updates, share ideas, follow people, see what's new, find people
          in COMMONS.
        </p>
        <div class="btn-container">
          <button
            class="btn"
            id="login-btn"
            onclick="location.href = 'pages/auth/login.html'"
          >
            LOGIN
          </button>
          <button
            class="btn"
            id="register-btn"
            onclick="location.href = 'pages/auth/register.html'"
          >
            REGISTER
          </button>
        </div>
      </main>
`;
