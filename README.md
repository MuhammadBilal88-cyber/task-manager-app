# 📋 Task Manager App

A full-stack task management application with FastAPI backend and vanilla JavaScript frontend. Deployed on Railway.

---

## 🌐 Live Demo

🔗 **Live URL:** [https://task-manager-app-production-8aac.up.railway.app](https://task-manager-app-production-8aac.up.railway.app)

📚 **API Docs:** [https://task-manager-app-production-8aac.up.railway.app/docs](https://task-manager-app-production-8aac.up.railway.app/docs)

---

## ✨ Features

- ✅ **Create** - Add new tasks with title and description
- 📝 **Edit** - Update task title, description, or status
- ✔️ **Complete/Incomplete** - Toggle task completion status
- 🗑️ **Delete** - Remove tasks you no longer need
- 🔍 **Filter** - View All, Active, or Completed tasks
- 💾 **Persistent Storage** - SQLite database saves your tasks
- 🎨 **Clean UI** - Responsive, modern design
- 📱 **Mobile Friendly** - Works on all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | FastAPI (Python) |
| **Database** | SQLite with SQLAlchemy ORM |
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **Deployment** | Railway |

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/{id}` | Get a single task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadBilal88-cyber/task-manager-app.git
cd task-manager-app