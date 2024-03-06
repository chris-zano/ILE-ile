## ILE: Integrated Learning Environment

This project aims to develop a comprehensive online learning platform (ILE) to support various learning activities and functionalities.

**Features:**

* **User Management:**
    * Role-based access control (admin, lecturer, student)
    * User accounts and authentication
* **Course Management:**
    * Create, edit, and manage courses
    * Assign lecturers and students
    * Upload and manage course materials
* **Live Lecture Room:**
    * Video conferencing with screen sharing
    * Real-time chat and Q&A features
    * Optional recording and playback functionalities
* **In-built IDE:**
    * Support for basic coding activities (language to be confirmed)
    * Syntax highlighting, basic code completion (optional)
* **Centralized Repository:**
    * Secure storage for course materials and assignments
    * Version control (optional)

**Tech Stack:**

* **Backend:**
    * Node.js
    * Express.js
    * EJS (templating engine)
    * Mongoose (MongoDB ODM)
    * Socket.io (real-time communication)
    * Multer.js (file upload handling)
    * Then-response (promise-based HTTP client)
    * uuid (unique identifier generation)
* **Database:** MongoDB
* **Optional:** WebRTC (real-time audio/video communication)
* **Containerization:** Docker

**Requirements:**

* Node.js and npm (or yarn) package manager installed
* MongoDB database running

**Getting Started:**

1. Clone this repository.
2. Install dependencies: `npm install`
3. Configure database connection details in the appropriate configuration file.
4. Run the application: `npm start` (or `yarn start`)

+ Authors 
    Christian Solomon,
    Jeremy Avadzi
