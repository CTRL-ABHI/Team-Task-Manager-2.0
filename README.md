# Team Task Manager

A complete, production-ready full-stack MERN application for managing team projects and tasks.

## Features

- **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (Admin/Member).
- **Project Management**: Admins can create and manage projects, assigning members to them.
- **Task Management**: Create, assign, update, and track tasks (Todo, In Progress, Completed).
- **Dashboard**: High-level overview of task statistics, including pending, completed, and overdue tasks.
- **Modern UI**: Built with React, Vite, and Tailwind CSS. Fully responsive, clean layout with modern cards and hover effects.

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API
- React Hot Toast
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcryptjs

## Prerequisites

- Node.js (v18+)
- MongoDB connection string (Atlas or Local)

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   *Edit `.env` and add your `MONGO_URI` and `JWT_SECRET`.*

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   cp .env.example .env
   ```
   *The default `VITE_API_URL` is set to `http://localhost:5000/api`.*

## Running Locally

Open two terminal windows/tabs:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The frontend will be accessible at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Environment Variables

### Backend (`server/.env`)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

This application is ready to be deployed on platforms like **Railway** and **Vercel**.

1. **Backend (Railway)**: Deploy the `server` folder. Set the environment variables in the Railway dashboard.
2. **Frontend (Vercel/Railway)**: Deploy the `client` folder. Set the Build Command to `npm run build` and Output Directory to `dist`. Add `VITE_API_URL` pointing to your deployed backend URL.
