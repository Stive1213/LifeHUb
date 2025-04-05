

# LifeHub - A Productivity and Life Management App

## Overview

LifeHub is a full-stack web application designed to help users manage their daily tasks, goals, budget, habits, and more in one centralized platform. The app provides a user-friendly interface with features like task management, budget tracking, a calendar, habit tracking, journaling, social networking, document storage, and gamification to keep users motivated. It includes user authentication with email/password signup, Google OAuth2 signup, and email verification for added security.

This project is built with a **React** frontend and a **Node.js/Express** backend, using **SQLite3** as the database. The app is styled with **Tailwind CSS** for a modern, responsive design.

---

## Features

### Frontend
- **Authentication:**
  - Signup and login with email and password.
  - Signup with Google OAuth2.
  - Email verification for email/password signup (users must verify their email before accessing the dashboard).
- **Pages:**
  - **Dashboard:** Overview of tasks, goals, budget, and more.
  - **Tasks & Goals:** Manage tasks and set goals.
  - **Budget Tracker:** Track expenses and income.
  - **Calendar:** View and manage events.
  - **Habits:** Track daily habits.
  - **Journal:** Write and view journal entries.
  - **Social Circle:** Manage friends and social interactions.
  - **Document Vault:** Upload and manage documents.
  - **Quick Tools:** Access tools like a calculator and timer.
  - **Community Hub:** Interact with community posts.
  - **Mental Wellness:** Access mental wellness resources.
  - **AI-Powered Assistant:** Chat with an AI for life tips.
  - **Gamification:** Earn points, badges, and view leaderboards.
  - **Notifications:** View task reminders, goal deadlines, and friend requests.
- **Sidebar:** Fixed sidebar with independent scrolling for navigation.
- **Route Protection:** Only authenticated users can access protected routes (e.g., dashboard, tasks).

### Backend
- **API Endpoints:**
  - `/api/auth/signup`: Register a new user with email and password.
  - `/api/auth/login`: Log in with email and password.
  - `/api/auth/google`: Sign up or log in with Google OAuth2.
  - `/api/auth/verify-email/:token`: Verify email using a token sent to the user’s email.
- **Database:** SQLite3 database (`lifehub.db`) to store user data.
- **Security:**
  - Passwords are hashed using `bcryptjs`.
  - JWT tokens for authentication.
  - Email verification for email/password signup.
- **Email Service:** Uses `nodemailer` to send email verification links.

---

## Tech Stack

### Frontend
- **React**: JavaScript library for building the user interface.
- **React Router**: For client-side routing.
- **Tailwind CSS**: For styling the app.
- **Axios**: For making HTTP requests to the backend.
- **Google OAuth2**: For Google signup/login.

### Backend
- **Node.js/Express**: For building the API.
- **SQLite3**: Lightweight database for storing user data.
- **bcryptjs**: For password hashing.
- **jsonwebtoken**: For generating JWT tokens.
- **nodemailer**: For sending email verification emails.
- **google-auth-library**: For Google OAuth2 authentication.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js** (v14 or higher): [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js.
- **Git**: For cloning the repository (optional).
- A **Google Cloud Project** with OAuth2 credentials for Google signup (see setup below).
- An email service (e.g., Gmail) for sending verification emails (see setup below).

---

## Setup Instructions

### 1. Clone the Repository (Optional)
If the project is hosted on a Git repository, clone it:
```bash
git clone https://github.com/your-username/lifehub.git
cd lifehub
```

Alternatively, if you’ve been following along, you should already have the `lifehub-frontend` and `lifehub-backend` directories.

### 2. Backend Setup

#### Navigate to the Backend Directory
```bash
cd lifehub-backend
```

#### Install Dependencies
```bash
npm install
```

#### Set Up Environment Variables
Create a `.env` file in the `lifehub-backend` directory and add the following:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

- **JWT_SECRET**: A random string for signing JWT tokens (e.g., generate with `openssl rand -base64 32`).
- **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: Obtain these from the Google Cloud Console:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/).
  2. Create a new project (e.g., "LifeHub").
  3. Go to **APIs & Services > Credentials**.
  4. Create an **OAuth 2.0 Client ID** (select "Web application").
  5. Set the **Authorized JavaScript origins** to `http://localhost:3000`.
  6. Set the **Authorized redirect URIs** to `http://localhost:5000/api/auth/google/callback`.
  7. Copy the Client ID and Client Secret to the `.env` file.
- **EMAIL_USER** and **EMAIL_PASS**: Use a Gmail account for sending emails:
  1. Go to your Google Account settings.
  2. Enable **2-Step Verification**.
  3. Generate an **App Password** (under Security > App Passwords).
  4. Use your email (e.g., `your_email@gmail.com`) and the app password in the `.env` file.

#### Start the Backend Server
```bash
npm start
```
- The backend should run on `http://localhost:5000`.
- You should see logs like:
  ```
  Server is running on port 5000
  Connected to SQLite database
  Users table created or already exists
  ```

### 3. Frontend Setup

#### Navigate to the Frontend Directory
```bash
cd lifehub-frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start the Frontend Server
```bash
npm start
```
- The frontend should run on `http://localhost:3000` and open in your browser automatically.

---

## Usage

1. **Access the App:**
   - Open `http://localhost:3000` in your browser.
   - You’ll land on the Auth page (`/`).

2. **Sign Up or Log In:**
   - **Email/Password Signup:**
     - Click “Sign Up”, enter an email and password, and submit.
     - Check your email for a verification link (it may go to spam).
     - Click the link to verify your email, then log in to access the dashboard.
   - **Google Signup:**
     - Click the “Sign in with Google” button, select your Google account, and you’ll be redirected to the dashboard.
   - **Login:**
     - If you’ve already signed up and verified your email, enter your email and password to log in.

3. **Explore Features:**
   - Navigate using the sidebar to access pages like Dashboard, Tasks & Goals, Budget Tracker, etc.
   - Test features like adding tasks, tracking habits, or viewing notifications.

4. **Protected Routes:**
   - If you try to access a protected route (e.g., `/dashboard`) without being logged in, you’ll be redirected to the login page.

---

## Project Structure

### Backend (`lifehub-backend/`)
```
lifehub-backend/
├── config/
│   └── database.js        # SQLite3 database configuration
├── controllers/
│   └── authController.js  # Authentication logic (signup, login, Google auth, email verification)
├── middleware/
│   └── authMiddleware.js  # Middleware for protecting routes (not fully implemented yet)
├── routes/
│   └── authRoutes.js      # Authentication routes
├── .env                   # Environment variables
├── index.js               # Main server file
└── lifehub.db             # SQLite database file (created on first run)
```

### Frontend (`lifehub-frontend/`)
```
lifehub-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Auth.jsx
│   │   ├── TasksGoals.jsx
│   │   ├── BudgetTracker.jsx
│   │   ├── Calendar.jsx
│   │   ├── Habits.jsx
│   │   ├── Journal.jsx
│   │   ├── SocialCircle.jsx
│   │   ├── DocumentVault.jsx
│   │   ├── QuickTools.jsx
│   │   ├── CommunityHub.jsx
│   │   ├── MentalWellness.jsx
│   │   ├── AIPoweredAssistant.jsx
│   │   ├── Gamification.jsx
│   │   └── Notifications.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── public/
└── package.json
```

---

## Testing

### Backend Testing
- Use a tool like Postman to test the API endpoints:
  - **Signup:** `POST http://localhost:5000/api/auth/signup`
    ```json
    {
      "email": "testuser@example.com",
      "password": "testpassword123"
    }
    ```
  - **Login:** `POST http://localhost:5000/api/auth/login`
    ```json
    {
      "email": "testuser@example.com",
      "password": "testpassword123"
    }
    ```
  - **Google Auth:** `POST http://localhost:5000/api/auth/google` (handled via frontend redirect).
  - **Verify Email:** `GET http://localhost:5000/api/auth/verify-email/:token` (accessed via email link).

### Frontend Testing
- Test in the browser:
  - Sign up with a new email, verify the email, and log in.
  - Sign up with Google and verify immediate access to the dashboard.
  - Test route protection by clearing localStorage and trying to access `/dashboard` (should redirect to login).

---

## Future Improvements

- **Additional Pages:**
  - User Profile Page (`/profile`).
  - Settings Page (`/settings`).
  - Health & Wellness Page (`/health-wellness`) for physical health tracking.
  - 404 Page for invalid routes.
  - Optional Search and Onboarding pages.
- **Mobile Responsiveness:** Optimize the frontend for mobile devices.
- **Backend Enhancements:**
  - Add more API endpoints for tasks, goals, budget, etc.
  - Implement route protection with JWT middleware.
  - Add password reset functionality.
- **Security:**
  - Validate and sanitize user input.
  - Add rate limiting to prevent abuse.
- **Testing:**
  - Add unit tests for backend routes using a framework like Jest.
  - Add end-to-end tests for the frontend using Cypress.

---

## Contributing

Contributions are welcome! If you’d like to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

---


## Contact

For questions or feedback, reach out to the project maintainers:
- Email: [estifanosamsalu833@gmail.com](mailto:estifanosamsalu833@gmail.com)
- GitHub: [stive1213](https://github.com/stive1213)
 
