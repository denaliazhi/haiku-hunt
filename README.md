# Haiku Hunt
By Denalia Zhi  [👩🏻](https://github.com/denaliazhi)

### A poetic search for landmarks around NYC
<img width="1461" height="915" alt="Cover photo for the app" src="https://github.com/user-attachments/assets/d6510a2a-b8de-41f2-85fd-ba2172890454" />

<br>**Part-scavenger hunt, part-poetry forum**. Guess landmarks around NYC based on haiku clues and contribute poetic takes of your own favorite places.

### 🎮 How to Play
Haiku Hunt is a free-style adventure.
1. Click on any landmark to view its clues.
2. Submit a guess for the landmark's name. Guess as many times as you want.
3. Once you've solved it, leave a clue of your own.
<img width="1461" height="915" alt="Features of the app" src="https://github.com/user-attachments/assets/f3490283-8153-4c26-81b5-2b5e8f387e3c" />

#### Features
Create an account to access the following features:
- Submit guesses for landmarks
- Track your solved landmarks
- Publish poems
- Manage poems you've published
- Save your favorite poems

**Check it out** → [<kbd> <br> Live preview <br> </kbd>](https://haiku-hunt.koyeb.app/)
---

### 👩🏻‍💻 Technical details
I created this app to practice various concepts learned in the [NodeJS module](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs) of TOP's[^1] Fullstack Javascript path.

|Language or Library | Concepts |
|---------| ---------|
| `Javascript` | Node.js<br>Express routing, MVC pattern<br>Authentication with `passport.js`<br>PostgreSQL, database management<br>Fetching from an external API<br>Server-side form validation<br>Error handling<br>Dynamic HTML with EJS|

#### Routes
| Endpoint | Method | Description|
|---------| ---------| ---------------------------- |
| `/` or `/all`| GET | Retrieves all landmarks |
| `/sign-up` | GET | Retrieves sign-up form |
| `/sign-up` | POST | Creates new user account |
| `/sign-in` | GET | Retrieves sign-in form |
| `/sign-in` | POST | Sets session to authenticated user |
| `/sign-out` | GET | Signs out the user |
| `/about` | GET | Includes details about the project |
| `/user` or `/user/published` | GET | Retrieves "published poems" view of user dashboard |
| `/user/saved` | GET | Retrieves "saved poems" view of user dashboard |
| `/user/solved` | GET | Retrieves "solved landmarks" view user dashboard |
| `/user/delete/:clueid` | POST | Deletes published clue |
| `/user/delete/:clueid` | POST | Deletes saved clue |
| `/:location` | GET | Retrieves landmarks matching search criteria |
| `/:location/:id` | GET | Retrieves details for a landmark |
| `/:location/:id/add` | GET | Retrieves clue submission form |
| `/:location/:id/add` | POST | Validates submitted clue |
| `/:location/:id/save/:clueid` | POST | Saves clue |
| `/:location/:id/unsave/:clueid` | POST | Unsaves clue |
| `/:location/:id/solve` | GET | Retrieves landmark guess form |
| `/:location/:id/solve` | POST | Validates guessed landmark |

#### Database
| Table | Fields |
| ----- | ----- |
| `landmarks` | `id INTEGER`<br> `name VARCHAR`<br> `number INTEGER`<br> `borough VARCHAR`<br> `parkname VARCHAR`<br> `location VARCHAR`<br> `extant CHAR`<br> `dedicated VARCHAR`<br> `descrip VARCHAR`<br> `architect VARCHAR`<br> `categories VARCHAR`<br> `x DECIMAL`<br> `y DECIMAL`<br> `url VARCHAR` |
| `users` | `userId INTEGER`<br> `username VARCHAR`<br> `password VARCHAR`<br> `admin BOOLEAN` |
| `clues` | `clueId INTEGER`<br> `landmarkId INTEGER`<br> `userId INTEGER`<br> `author VARCHAR`<br> `haiku_line_1 VARCHAR`<br> `haiku_line_2 VARCHAR`<br> `haiku_line_3 VARCHAR`<br>  `submitted DATE`<br> `votes INTEGER` |
| `saved_clues` | `userId INTEGER`<br> `clueId INTEGER`|
| `solved_landmarks` | `userId INTEGER`<br> `landmarkId INTEGER`|
| `session` | `sid VARCHAR`<br> `sess JSON`<br> `expire TIMESTAMP` |

#### Environment variables
The following variables are required to run this app:
- `APP_TOKEN` to access and fetch initial landmarks form the NYC Open Data API (see `initialLandmarks.js`)
- `DATABASE_HOST` to connect to the postgreSQL database via Koyeb (see `dbConnection.js`)
- `DATABASE_NAME` to connect to the postgreSQL database
- `DATABASE_PWD` to connect to the postgreSQL database
- `DATABASE_USER` to connect to the postgreSQL database
- `SECRET` to set up the session (see `app.js`)
- `APP_USER`/`APP_USER2`/`APP_PWD`/`APP_PWD2` to populate the initial users table (see `initialUsers.js`)

#### Installation
1. Clone the repo to your local machine `git clone https://github.com/denaliazhi/haiku-hunt.git`
2. Navigate to the project directory `cd haiku-hunt`
3. Install required dependencies `npm install`
4. Create `.env` with the required environment variables
5. Start the app `npm run start`
  
👀 Please see my [commit history](https://github.com/denaliazhi/haiku-hunt/commits/main/) for details on my problem-solving process

---

#### 🔨 Known issues
If I were to revisit this project at a later date, I'd want to address the following:
- When submitting a haiku, the user may get an error stating that a line doesn't match the expected syllabic count, but it actually does. The language library that is used to validate this information mistakes certain instances where a word is pronounced with fewer syllables than its spelling suggests.
- This project currently runs on a free database service with limited compute time. Once the 5h limit is reached, only the home, about, and sign-in pages are rendered. All other pages depend on queries to the database, so they will return error messages.
- When a user unsaves a poem from their dashboard, the user is redirected to the landmark details page for the poem that they just unsaved. Ideally, the user should remain on their dashboard after unsaving a poem.

[^1]: What is TOP? [The Odin Project](https://www.theodinproject.com/about) is an open-source, self-guided web development curriculum. I started TOP in April 2025.
