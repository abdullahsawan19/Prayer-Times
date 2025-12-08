📖 Prayer Times React App

A simple React application that displays daily prayer times for a selected city using the Aladhan API, with full Dark Mode support and clean state management using the Context API.

🚀 Features

Fetches prayer times dynamically using an external API.

Built-in Dark Mode using a dedicated context.

Change city and country at runtime.

Clean architecture using Context API + Custom Hooks.

Components fully separated from business logic.

🛠️ Tech Stack

React (Hooks + Context API)

Axios for API calls

CSS for styling

Aladhan Prayer Times API

📂 Project Structure
src/
│── App.js
│── App.css
│
├── components/
│   └── Payars.jsx
│
├── DarkModeContext.js
└── PrayerTimesContext.js

⚙️ How It Works
1️⃣ Dark Mode Context

Handles the current theme (light/dark) and provides a setter:

const [darkMode, setDarkMode] = useState(false);


Usage inside any component:

const { darkMode, setDarkMode } = useDarkMode();

2️⃣ Prayer Times Context

Fetches prayer times from the API based on the selected city and country:

API used:

https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5


Provided values:

timings

loading

city, setCity

country, setCountry

Usage:

const { timings, loading } = usePrayerTimes();
