# Drag_And_Drop
# 🐞 Mini Issue Tracker

A full-stack mini issue tracker app built using **React** (frontend) and **FastAPI** (backend). This app allows users to manage project issues with authentication, filtering, drag-and-drop, and team collaboration features.

---

## 🚀 Features

### ✅ Core Functionalities

- **User Authentication** (Token)
- **CRUD for Issues**:
  - Fields: `title`, `description`, `status` (`OPEN`, `IN_PROGRESS`, `CLOSED`)
  - Optional: tags, priority
- **User Permissions**: only owner can edit/delete their issues
- **Issue Dashboard** with:
  - Status filters
  - Drag-and-drop for status change
---

## 🧪 Tech Stack

| Layer       | Tech         |
|-------------|--------------|
| Frontend    | React        |
| Backend     | FastAPI      |
| Styling     | CSS          |
| Auth        | Token        |
| Database    | JSON         |

---

## ⚙️ Project Setup

### 🖥️ Frontend (React)

```bash
cd frontend
npx create-react-app drag_and_drop
npm install
npm run start

cd backend
# If FastAPI:
pip install fastapi uvicorn
uvicorn drag_and_drop_backend:app --reload
