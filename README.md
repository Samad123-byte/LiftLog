<div align="center">

<img src="./client/src/assets/logo.png" width="90" />

# LiftLog

### 💪 Train. Track. Progress.

A modern **MERN Stack Fitness Tracker** that helps users build workout plans, log every workout session, monitor personal records, and track long-term progress with a clean and intuitive interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge)
![License](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

# 📖 About

LiftLog is a full-stack fitness tracking application built using the **MERN Stack**.

The application allows users to create personalized workout plans, complete workout sessions, automatically calculate workout statistics, and maintain personal records for every exercise.

An **Admin Dashboard** is included for managing the exercise library, making LiftLog suitable for both fitness enthusiasts and gym management systems.

---

# ✨ Features

## 👤 User Features

- Secure Authentication (JWT)
- User Profile Management
- Create Workout Plans
- Assign Workouts to Days
- Browse Exercise Library
- Search & Filter Exercises
- Start Workout Sessions
- Log Sets, Reps & Weight
- Automatic Workout Statistics
- Workout History
- Personal Records Tracking
- Dashboard Analytics
- Responsive Interface

---

## 👨‍💻 Admin Features

- Admin Authentication
- Create Exercises
- Edit Exercises
- Delete Exercises
- Upload Exercise Images
- Manage Exercise Library
- Organize by Muscle Groups
- Difficulty Management
- Equipment Management

---

# 📊 Dashboard

The dashboard provides an overview of user activity including:

- Workout Plans
- Workout Sessions
- Exercise Library
- Personal Records
- Lifetime Volume
- Recent Workouts

---

# 🏋 Workout Plans

Users can

- Create custom workout plans
- Select workout days
- Add multiple exercises
- Define sets & reps
- Edit plans
- Delete plans

---

# 📝 Workout Sessions

Every completed workout stores

- Duration
- Total Volume
- Total Sets
- Total Repetitions
- Notes
- Completed Date

Workout history is automatically generated.

---

# 🏆 Personal Records

LiftLog automatically updates personal records whenever a user performs:

- Higher Weight
- Higher Repetitions

Each record stores

- Exercise
- Best Weight
- Best Reps
- Achievement Date
- Workout Reference

---

# 📚 Exercise Library

Exercises include

- Name
- Muscle Group
- Equipment
- Difficulty
- Category
- Thumbnail
- Description

Searching and filtering are supported.

---

# ⚙ Tech Stack

## Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Context API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary

---

# 📂 Project Structure

```
LiftLog
│
├── client
│   ├── src
│   ├── assets
│   ├── components
│   ├── pages
│   ├── context
│   └── services
│
└── server
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── config
    └── utils
```

---

# 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/Samad123-byte/LiftLog.git
```

### Install dependencies

Client

```bash
cd client
npm install
```

Server

```bash
cd server
npm install
```

---

### Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

### Start Development

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# 📌 API Modules

Authentication

- Register
- Login
- Profile
- Update Profile

Exercise

- Create
- Update
- Delete
- Get All
- Get Single

Workout Plans

- Create Plan
- Update Plan
- Delete Plan
- Today's Workout

Workout Sessions

- Create Session
- View History
- View Details

Personal Records

- Automatic Record Creation
- Record History

---

# 🔒 Authentication

LiftLog uses

- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Password Hashing with bcrypt

---

# 🎯 Future Improvements

- 🤖 AI Workout Assistant
- 📈 Progress Charts
- 📅 Calendar View
- 🔥 Streak Tracking
- 🥗 Nutrition Tracker
- 💧 Water Intake
- 😴 Sleep Tracking
- 📱 PWA Support
- 🌙 Dark/Light Theme
- 📤 Export Workout History (PDF)

---

# 👨‍💻 Author

**Abdul Samad Khan**

Full-Stack Developer (MERN + WordPress)


---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

Made with ❤️ using the MERN Stack.

</div>
