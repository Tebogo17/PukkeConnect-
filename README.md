# 🎓 PukkeConnect Frontend

![PukkeConnect Homepage](./assets/pukkeconnect_homepage.png)

The **PukkeConnect Frontend** is a responsive, modern web interface built for the **PukkeConnect** platform — a university-based digital ecosystem that enables students, academic representatives, and administrators to connect, collaborate, and share information efficiently.

This client application is built with **React.js** and communicates with the backend via secure RESTful APIs.

---

## 🚀 Overview

The frontend enables:
- 🎓 Student and representative dashboards  
- 📢 Announcement management and notifications  
- 🔐 Secure authentication using JWT tokens  
- ⚙️ Seamless integration with the Express + PostgreSQL backend  
- 📱 Responsive design for desktop and mobile  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | React.js (Create React App or Vite) |
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

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/pukkeconnect-frontend.git
cd pukkeconnect-frontend
```

---

### 2️⃣ Install Dependencies
```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Then set your API base URL (pointing to the backend):
```env
REACT_APP_API_URL=http://localhost:5000
```

This ensures all API requests connect to your running backend service.

---

### 4️⃣ Run the Application

Start the development server:
```bash
npm start
```

Then open in your browser:  
👉 **http://localhost:3000**

---

### 5️⃣ Build for Production
```bash
npm run build
```

This creates an optimized production build inside the `/build` folder.

---

## 🔗 Backend Integration

All API calls are made through Axios using the `REACT_APP_API_URL` variable.

**Example API call:**
```javascript
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export const fetchAnnouncements = async () => {
  const response = await axios.get(`${API}/api/announcements`);
  return response.data;
};
```

**Ensure your backend is running before launching the frontend:**
```
Backend → http://localhost:5000
Frontend → http://localhost:3000
```

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
| **Netlify** | Drag `/build` folder or connect GitHub repo |
| **GitHub Pages** | Run `npm run build` → Deploy via `gh-pages` package |

---

## 🧑‍💻 Contributors

| Name | Role | Contact |
|------|------|----------|
| [Your Name] | Frontend Developer | [your.email@example.com] |
| [Contributor Name] | UI/UX Designer | |
| [Contributor Name] | QA Tester | |

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

### 📝 Commit Message Example

```
docs: add frontend README with homepage image and setup instructions

Updated documentation to include homepage image preview and setup steps for running and deploying the PukkeConnect frontend.
Includes environment configuration, API integration guide, and troubleshooting notes.
```
