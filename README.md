# odoo-hackathon-2025

## Problem Statement 1 - Skill Swap Platform 

### member 1 name - Shailesh Chauhan
### member 1 email - contactsh1lezh@gmail.com

### member 2 name - Rudra Suthar 
### member 2 email - rudracodelearner@gmail.com

### member 3 name - Mihir Mistry 
### member 3 email - mmihir2909@gmail.com


# Skill Swap Platform

A platform for users to exchange skills and knowledge with each other.

## Project Structure

- `skill-swap-backend/` - FastAPI backend server
- `skill-swap-frontend/` - React frontend application

## Backend Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
```bash
cd skill-swap-backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python run.py
```

The backend will start on `http://localhost:8000`

### API Endpoints

- `GET /` - Health check
- `POST /register/` - User registration
- `POST /login/` - User login
- `POST /skill-swap-request/` - Create skill swap request
- `GET /skill-swap-requests/` - Get all skill swap requests
- `GET /user/{user_id}` - Get user profile

## Frontend Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd skill-swap-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Running the Application

1. Start the backend first:
```bash
cd skill-swap-backend
python run.py
```

2. In a new terminal, start the frontend:
```bash
cd skill-swap-frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Features

- User registration and authentication
- Skill swap request creation and management
- User profile management
- Modern, responsive UI with Tailwind CSS

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - SQL toolkit and ORM
- SQLite - Database
- Pydantic - Data validation

### Frontend
- React 18 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client
- React Router - Navigation
- Lucide React - Icons
