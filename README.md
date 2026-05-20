# Smart Attendance System

A robust, AI-driven attendance management platform designed to prevent proxy attendance using a "Triple-Lock Verification" protocol.

## 🚀 Technical Stack
* **Backend:** Java, Spring Boot
* **Frontend:** React
* **Database:** PostgreSQL
* **Security:** JWT (JSON Web Tokens), Spring Security
* **Key Technologies:** Geofencing, Hardware Fingerprinting, REST APIs

## 💡 Key Features
* **Triple-Lock Verification:** Ensures attendance is only logged when device, location, and hardware signatures match.
* **Geofencing:** Restricts attendance logging to authorized campus/office zones.
* **Real-time Sync:** Instant synchronization between the mobile/web interface and the central database.
* **Role-Based Access:** Dedicated portals for students, mentors, and administrators.

## 🔗 Live Demo
[🔗 View Live Demo](https://smartattendance-b44.pages.dev)
*Note: This demo is hosted on a free-tier service and may experience downtime. If the link is unavailable, please see the screenshots below.*

## 📸 System Dashboard
*(Drag and drop your screenshots here)*

## 🛠️ How to Run Locally
1. **Clone the repo:** `git clone https://github.com/manikantapathakoti08-eng/smartAttendance.git`
2. **Backend:** Navigate to the backend folder and run `mvn spring-boot:run`.
3. **Frontend:** Navigate to the frontend folder, run `npm install`, then `npm start`.
