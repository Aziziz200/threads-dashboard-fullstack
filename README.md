# Threads Dashboard Fullstack

A real‑time social media dashboard with authentication, posts, comments, and live likes. Built as a modern full‑stack showcase using Next.js, Hapi.js, Socket.io, and MongoDB.

## ✨ Features
- JWT authentication (register/login)
- Create posts (max 500 chars)
- Real‑time likes (Socket.io)
- Nested comments with real‑time updates
- Sleek dark/light UI with Tailwind CSS
- RESTful API with Hapi.js

## 🛠 Tech Stack
**Frontend**  
- Next.js 14 (App Router)  
- TypeScript  
- Tailwind CSS  
- Socket.io‑client  
- React Hot Toast  

**Backend**  
- Hapi.js  
- TypeScript  
- MongoDB with Mongoose  
- Socket.io  
- JWT authentication  

## 📋 Requirements
- **Node.js** (v18 or later)  
- **npm** or **yarn**  
- **MongoDB** (local or Atlas)  
- **Git** (to clone the repo)

## 🚀 How to Use It

### 1. Clone the repository
```bash
git clone https://github.com/Aziziz200/threads-dashboard-fullstack.git
cd threads-dashboard-fullstack

2. Backend Setup
bash
cd backend
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# (example: MONGODB_URI=mongodb://localhost:27017/threads)

# Start development server
npm run dev
The backend will run on http://localhost:3001.

3. Frontend Setup
Open a new terminal and navigate to the frontend folder:

bash
cd frontend

# Install dependencies
npm install

# Create .env.local file from example
cp .env.local.example .env.local
# (Make sure NEXT_PUBLIC_API_URL points to your backend URL, default is http://localhost:3001/api)

# Start development server
npm run dev

The frontend will run on http://localhost:3000.

4. Access the application
Open your browser and go to http://localhost:3000. Register a new account and start posting!

📦 Build for Production
Backend

bash
cd backend
npm run build
npm start
Frontend

bash
cd frontend
npm run build
npm start
🧪 Database Seeding (Optional)
If you want to seed some initial data, you can create a custom script. Currently, no automatic seed is provided.

📁 Project Structure
text
threads-dashboard-fullstack/
├── backend/          # Hapi.js + Socket.io server
│   ├── src/
│   ├── package.json
│   └── ...
└── frontend/         # Next.js app
    ├── src/
    ├── package.json
    └── ...
🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
