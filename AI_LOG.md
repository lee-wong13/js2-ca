# AI LOG

## Conversation / prompt log

### 2026-09-14

Prompt: Give me an idea of what I should do first.

Answer:

- Start with the API key and backend configuration
- Make sure auth is working before building the UI around it
- Then move into login/register, feed, post, and profile flows

Claude

### 2026-09-14

Prompt: I'm writing the UI for the page but I'm not sure where to put them.

Answer:

- Each screen should have its own HTML page in pages/
- Its script logic should live in src/ui/ or the matching UI folder
- Shared rendering helpers go in src/utils/

Claude

### 2026-09-21

Prompt: When I click on Login btn it didn't lead to login page, why?

Answer:

- The Login button was navigating correctly, but the login page failed to load its JavaScript due to an invalid import in auth.js: it tried importing API_KEY_STORAGE_KEY, which is not exported by the storage module.
- Updated the auth module to use AUTH_API endpoint constants and fixed login flow to save the session

CoPilot

### 2026-09-21

Prompt: I tried to log in, but it said Failed to log in, something is wrong with the logic?

Answer:

- The login logic incorrectly treated Noroff API-key creation as required for a successful sign-in. Noroff currently returns 500 for that endpoint, even after valid authentication.
- Login saves the session and redirect to feed pages

CoPilot

### 2026-09-21

Prompt: why the feed page doesn't show any posts?

Answer:

- The feed is working, but it cannot fetch posts because there is no saved Noroff API key. getPosts stops when loadApiKey() is empty and shows: “No Noroff API key found.” The key is missing because Noroff’s /auth/create-api-key endpoint returned HTTP 500 during login. Your session token is saved, but post requests require both the token and an API key.

Fixed:

- Got API Key from https://docs.noroff.dev/docs/v2/auth/api-key and pasted it in DevTool console for my local storage

CoPilot

### 2026-09-21

Prompt: why when click a post to see a single post it direct back to index.html?

Answer:

- The post links were relative (../post/index.html). Because there are two feed page locations, that sometimes resolved to a non-existent post page and Vite returned the root index.html.

Fixed:

- Changed route in render.js: /pages/pages/post/index.html?id=...

CoPilot

### 2026-09-21

Prompt: Why doesn't header shows in feed page?

Answer:

- Because the header is not being imported in feed.js

CoPilot

### 2026-09-22

Prompt: I tried to click a profile, but it led me back to index.html

Answer:

- the path was duplicated. Fixed files name.

CoPilot

### 2026-09-23

Prompt: Now that I deployed, the page doesn't show, why?

Answer:

- Several URLs started with /, which breaks when deployed under a project subpath, and GitHub is quite sensitive with paths.

CoPilot
