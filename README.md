# Cohort-Based Course Platform

## Overview

This is a **cohort-based online course platform** built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to enroll in courses, pay for cohorts, access course content, track progress, and download certificates. Admins can manage courses, cohorts, users, and certificates. Optional features include discussion forums, peer activities, and live sessions.

---

## Features

### User Features

- Register and login
- Browse available courses and cohorts
- Enroll in a cohort
- Secure payment via Stripe
- Access lessons, modules, and downloadable resources
- Track lesson/module completion
- Participate in optional discussion forums and peer activities
- Attend optional live sessions
- Download PDF certificates after course completion

### Admin Features

- Secure admin login
- Create and manage courses
- Create and manage cohorts (capacity, start/end dates, price)
- Monitor user enrollments and payments
- Approve or override user completion
- Generate and manage certificates
- Moderate discussion forums
- Schedule live sessions

### Optional Features

- Discussion forum per cohort
- Peer activities and group assignments
- Live sessions/webinars

---

## Technologies Used

- **Frontend:** React, React Router, Context API, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT-based authentication with role-based access
- **Payments:** Stripe integration
- **PDF Generation:** Node PDF library (e.g., pdfkit)

---

## Installation

### Prerequisites

- Node.js >= 16.x
- MongoDB
- npm or yarn
- Stripe account (for payments)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env   # configure environment variables
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

The app should now be running at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

---

## Database Structure

### User

- \_id
- name
- email
- passwordHash
- role (user | admin)
- createdAt

### Course

- \_id
- title
- description
- modules: [Module]
- certificateTemplate
- createdAt

### Module

- title
- lessons: [Lesson]

### Lesson

- title
- contentType (text | PDF | video)
- contentURL

### Cohort

- \_id
- courseId
- name
- price
- capacity
- startDate
- endDate
- enrolledUsers: [userId]
- createdAt

### Enrollment

- \_id
- userId
- cohortId
- paymentStatus
- completionStatus
- progress
- certificateId

### Certificate

- \_id
- userId
- courseId
- cohortId
- certificateURL
- issuedAt

---

## Flow

1. User registers/logs in
2. Browse courses & cohorts
3. Enroll & pay via Stripe
4. Access course content
5. Track completion
6. Certificate generated and downloadable
7. Admin manages courses, cohorts, users, and certificates

Optional: discussion forums, live sessions, and peer activities

---

## Notes

- All sensitive operations are secured with JWT authentication.
- Role-based access control ensures separation of user and admin privileges.
- Cohort-based system allows scheduling, tracking, and batch management.
- Payments and certificates are fully integrated with backend verification.

---

## Future Enhancements

- Notifications & email alerts
- Multi-language support
- Enhanced analytics for admins
- Integration with Zoom or other live session tools
- Mobile app version
