# TeamFlow 🚀

**Live Demo:** [team-flow-taupe.vercel.app](https://team-flow-taupe.vercel.app)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/adityaj99/TeamFlow)

TeamFlow is a full-stack, scalable task management and collaboration platform. It allows organizations to manage projects, assign tasks, and maintain real-time oversight over team productivity, backed by a robust background-worker architecture for notifications and emails.

![TeamFlow Dashboard](./frontend/public/images/Screenshot%202026-04-29%20213341.png)

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Secure access levels for Owners, Admins, Manager, and Members within an organization.
- **Task Lifecycle Management:** Create, assign, track, and update tasks with priority levels and due dates.
- **Asynchronous Background Processing:** Heavy tasks like email delivery and system notifications are offloaded to dedicated Redis-backed worker instances, ensuring the main API remains lightning fast.
- **Scalable Architecture:** Built with a decoupled frontend and a multi-service backend environment.

---

## 🛠️ Tech Stack

**Frontend:**

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

**Backend:**

- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Email Service:** Resend
- **Queue Management:** BullMQ & Upstash Redis
- **Hosting:** Render (Multi-Service Deployment)

---

## 🏗️ System Architecture

The backend is intentionally split into two continuously running services deployed from a single codebase to ensure high availability and performance:

1. **Main API Server:** Handles incoming HTTP requests, CRUD operations, authentication, and writes heavy jobs to the Redis queue.
2. **Background Workers:** Dedicated Node.js processes that listen to Upstash Redis using BullMQ to handle computationally expensive tasks like sending emails without blocking the main event loop.

---

## 🔐 Environment Variables

To run this project locally, create a `.env` file in the `backend` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=developement
FRONTEND_URL=http://localhost:5173
CLOUD_NAME=cloudinary_cloud_name
CLOUD_API_KEY=cloudinary_api_key
CLOUD_API_SECRET=cloudinary_api_secret
UPSTASH_REDIS_URL=rediss://your_upstash_url
RESEND_API_KEY=your_resent_email_service_api_key
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js (v18+)
- MongoDB URI
- Upstash Redis URL

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/adityaj99/TeamFlow.git
```

**2. Setup the Backend**

```bash
cd TeamFlow/backend
npm install
```

**3. Setup the Frontend**
Open the new terminal:

```bash
cd TeamFlow/frontend
npm install
npm run dev
```

**4. Start the Backend Services**
You will need two terminal windows for the backend to simulate the production environment:

**Terminal 1 (Main API):**

```bash
cd TeamFlow/backend
npm run dev
```

**Terminal 2 (Background Workers):**

```bash
cd TeamFlow/backend
npm run dev:worker
```

---

## 📡 Core API Endpoints

| Route                  | Method   | Description                     | Requires Auth   |
| ---------------------- | -------- | ------------------------------- | --------------- |
| `/api/auth/register`   | `POST`   | Register a new user             | ❌              |
| `/api/auth/login`      | `POST`   | Authenticate and return JWT     | ❌              |
| `/api/org`             | `POST`   | Create a new organization       | ✅              |
| `/api/project`         | `POST`   | Create a new project            | ✅              |
| `/api/task`            | `POST`   | Create a new task within an org | ✅              |
| `/api/task/:id`        | `PATCH`  | Update task details             | ✅ (Admin only) |
| `/api/task/:id/status` | `PATCH`  | Update task status              | ✅              |
| `/api/task/:id`        | `DELETE` | Delete a task                   | ✅ (Admin only) |

## 🗺️ Roadmap

- [ ] Implement WebSockets (Socket.io) for real-time task updates.

- [ ] Add drag-and-drop Kanban board view for tasks.

- [ ] Integrate third-party OAuth (Google/GitHub login).

- [ ] Generate downloadable PDF reports for organization statistics.

## 👨‍💻 Author

**Aditya Jadhav**

[![GitHub Profile](https://img.shields.io/badge/GitHub-aditya99-black?logo=github)](https://github.com/adityaj99/)
