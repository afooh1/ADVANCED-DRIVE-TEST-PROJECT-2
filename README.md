# ADVANCED-DRIVE-TEST-PROJECT-2
a complete web application for blog posting, user authentication, and driving test appointment scheduling, built using Node.js, Express, MongoDB, and Mongoose.

📋 Project Overview
This full-stack project allows users to:

Sign up and log in securely.

Create, edit, and view blog posts.

Schedule driving test appointments (G2, G, Examiner).

Manage users and posts using a clean, organized MVC structure.

The system demonstrates real-world user management, content management, and service booking functionality.

🛠️ Tech Stack
Node.js — Backend server runtime

Express.js — Backend web framework

MongoDB + Mongoose — Database and ORM

HTML5 / CSS3 / JavaScript — Frontend styling and scripting

Postman — API testing

📁 Folder Structure
bash
Copy
Edit
/blogapp_register 1
│
├── index.js                   # Main server file
├── package.json                # Project metadata
│
├── /controllers/
│   ├── authController.js       # Authentication handlers
│   ├── appointmentController.js# Appointment logic
│   ├── examinerController.js   # Examiner booking logic
│   ├── g2Controller.js         # G2 test appointment controller
│   ├── gController.js          # G test appointment controller
│   ├── homeController.js       # Homepage rendering
│   ├── loginController.js      # Login page
│   ├── newPostController.js    # Create new post form
│   ├── newUserController.js    # Registration form
│   ├── storePostController.js  # Save blog posts
│   └── storeUserController.js  # Save new users
│
├── /middlewares/
│   ├── authMiddleware.js       # Authentication middleware
│   └── validateMiddleware.js   # Validation middleware
│
├── /models/
│   ├── Appointment.js          # Appointment schema
│   ├── BlogPost.js              # Blog post schema
│   └── User.js                  # User schema
│
├── /public/
│   ├── css/
│   │   └── styles.css           # Frontend styling
│   ├── js/
│   │   └── scripts.js           # Frontend behavior
│   └── img/
│       └── (Images for posts and pages)
✨ Key Features
🔐 User Authentication:

User sign-up, login, and secure session handling.

✍️ Blog Post Management:

Users can create and view blog posts with featured images.

🛻 Driving Appointment Booking:

Book G2, G, or Examiner driving test appointments.

🧩 MVC Architecture:

Clear separation of concerns with models, views, and controllers.

🖥️ Responsive Frontend:

Clean and responsive UI design using pure CSS and basic JS enhancements.

⚙️ Middleware:

Custom authentication and validation middleware for securing and validating user actions.
