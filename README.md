# Collab Kanban Board 

Hi there!  
This is my submission for the collaborative real-time Kanban board assignment built using the **MERN Stack** + **Socket.IO**.

I created this project to showcase my skills in full-stack web development, real-time collaboration, and clean UI design. It includes all the required features like login/register, real-time task syncing, smart assign logic, and conflict resolution — and I even added a few extras to make it stand out.

##  Live Demo

-  **Frontend**: https://collab-kanban-board.vercel.app/  
-  **Backend API**: https://collab-kanban-board.onrender.com
-  **Demo Video**: https://your-demo-video-link.com  
-  **Logic Document**: https://github.com/sania102/collab-kanban-board/blob/main/Logic_Document.md

---

##  What This App Can Do

 Register/Login securely (JWT Auth)  
 Realtime task collaboration using Socket.IO  
 Create, drag & drop tasks in Kanban-style columns  
 Activity Log panel (tracks who did what and when)  
 “Smart Assign” distributes tasks fairly among users  
 Clean, professional UI with animation effects  
 Conflict-safe task updates   



##  Tech Stack

- **Frontend**: React, Axios, React Router, react-beautiful-dnd
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose
- **Real-time**: Socket.IO
- **Deployment**: Vercel (Frontend), Render (Backend)


##  How to Run Locally

###  Backend Setup

cd backend
npm install
npm run dev

###  Frontend Setup
cd frontend
npm install
npm start

### Smart Assign Logic
When creating a task, clicking the “Smart Assign” button tells the app to automatically assign the task to the user who currently has the fewest tasks.
It checks all tasks in the database
It counts how many tasks each user has
It picks the user with the least
This helps keep the workload fairly distributed.

### Conflict Handling Logic
In case two users try to update the same task at the same time:

The app uses a Last Write Wins approach — the most recent change is saved

Socket.IO pushes real-time updates to all users

This ensures everyone sees the latest task data and avoids silent overwrites

### Demo Video Walkthrough
In this short demo video, I cover:
What the project is
Login and register flow
Creating tasks manually and with Smart Assign
Realtime updates using Socket.IO
Drag-and-drop task movement
How conflict handling and logging work

### Logic Document
You can find a summary of my Smart Assign and conflict resolution logic here:
 Logic_Document.md


