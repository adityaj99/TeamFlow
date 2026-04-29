# TeamFlow 🚀

**Live Demo:** [team-flow-taupe.vercel.app](https://team-flow-taupe.vercel.app)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/adityaj99/TeamFlow)

TeamFlow is a full-stack, scalable task management and collaboration platform. It allows organizations to manage projects, assign tasks, and maintain real-time oversight over team productivity, backed by a robust background-worker architecture for notifications and emails.

![TeamFlow Dashboard](./screenshot-placeholder.png) _(Note: Take a screenshot of your app, save it in your repo, and update this path!)_

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Secure access levels for Owners, Admins, and Members within an organization.
- **Task Lifecycle Management:** Create, assign, track, and update tasks with priority levels and due dates.
- **Asynchronous Background Processing:** Heavy tasks like email delivery and system notifications are offloaded to dedicated Redis-backed worker instances, ensuring the main API remains lightning fast.
- **Scalable Architecture:** Built with a decoupled frontend and a multi-service backend environment.

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS / Components
- Hosted on Vercel

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose
- Upstash Redis (for BullMQ queues)
- Hosted on Render (Multi-Service Deployment: API Service & Background Worker Service)

## 🏗️ System Architecture

The backend is intentionally split into two continuously running services deployed from a single codebase:

1. **Main API Server:** Handles incoming HTTP requests, CRUD operations, authentication, and writes jobs to the Redis queue.
2. **Background Workers:** Dedicated Node.js processes that listen to Upstash Redis using BullMQ to handle computationally expensive tasks like sending emails without blocking the main event loop.

## 🚀 Running Locally

### Prerequisites

- Node.js (v18+)
- MongoDB URI
- Upstash Redis URL

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/adityaj99/TeamFlow.git](https://github.com/adityaj99/TeamFlow.git)
   ```
