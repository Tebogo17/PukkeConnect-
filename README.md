# 🎓 PukkeConnect Frontend

![PukkeConnect Homepage](https://github.com/Tebogo17/PukkeConnect-/blob/4eccdef6d480d569a03219a51752d83e1509236c/Capture.PNG)

**PukkeConnect Frontend**

Welcome to the **PukkeConnect Frontend**, the interactive web platform that helps NWU students connect with societies, clubs, and organizations that match their interests.

Built using React.js and Tailwind CSS, PukkeConnect’s frontend is designed for speed, simplicity, and an engaging user experience.

---

## 🚀 Overview

The frontend enables:
- 🎓 Student and representative dashboards  
- 📢 Announcement management and notifications  
- 🔐 Secure authentication using JWT tokens  
- ⚙️ Seamless integration with the Express + PostgreSQL backend  
- 📱 Responsive design for desktop and mobile
---

**Tech Stack**

| Layer | Technology |
|-------|-------------|
| Framework | React.js (Create React App) |
| State Management | Context API / Redux (depending on setup) |
| HTTP Client | Axios |
| Styling | Tailwind CSS / CSS Modules |
| Routing | React Router |
| Environment | dotenv |
| Deployment | Vercel / GitHub Pages |

---

## 📁 Project Structure

```
frontend/
│
├── src/
│   ├── assets/           # Images, icons, and static files
│   ├── components/       # Reusable UI components
│   ├── pages/            # Main application pages (Dashboard, Login, etc.)
│   ├── services/         # API integration via Axios
│   ├── context/          # Authentication or global context
│   ├── App.js            # Main React component
│   └── index.js          # React DOM entry point
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── package.json
├── .env.example
└── README.md
```

---

### Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
Then set your API base URL (pointing to the backend):
```env
REACT_APP_API_URL=http://localhost:5000
This ensures all API requests connect to your running backend service.

---
## 🧩 Common Commands

| Command | Description |
|----------|-------------|
| `npm start` | Run in development mode |
| `npm run build` | Build for production |
| `npm test` | Run unit tests (if configured) |
| `npm run lint` | Check code quality |

---

## 🧠 Troubleshooting

| Issue | Possible Solution |
|--------|--------------------|
| API requests failing | Ensure backend (`localhost:5000`) is running |
| CORS errors | Confirm CORS is enabled in the backend |
| “Module not found” | Run `npm install` again |
| `.env` not detected | Restart React after editing `.env` |

---

## 🌐 Deployment

| Platform | Instructions |
|-----------|--------------|
| **Vercel** | Connect repo → Set `REACT_APP_API_URL` in environment settings → Deploy |
| **GitHub Pages** | Run `npm run build` → Deploy via `gh-pages` package |

---
