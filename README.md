# User Center (Full-Stack Practice Project)

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)
![Status](https://img.shields.io/badge/Status-Live_Demo_Available-success)

> A web application developed to practice full-stack development and cloud deployment.
> It features user authentication and management, deployed on a real Linux server.

🚀 **Live Demo:** [https://user-center.yuhanwang.dev](https://user-center.yuhanwang.dev)

---

## 📖 Introduction

This is my first full-stack project aimed at learning the complete software delivery process. 
My goal was not just to write code, but to successfully deploy a Java/React application to the public internet using Docker.

**Key Features:**

* User Registration & Login
* Admin Dashboard (User Management)
* User Profile Display

## 🛠️ Tech Stack

I chose industry-standard technologies to build this project:

* **Backend:** Java 21, Spring Boot 3, MyBatis-Plus
* **Database:** MySQL 8.0
* **Frontend:** React, UmiJS, Ant Design Pro
* **Deployment:** Docker & Docker Compose
* **Server:** Hetzner Cloud (Linux/Ubuntu)

## ☁️ Deployment

Unlike simple local projects, I challenged myself to deploy this app to a remote server.

* **Containerization:** The app runs in Docker containers to ensure consistency between my local machine and the cloud.
* **Web Server:** I used **Nginx** to serve the frontend static files.
* **Security:** I configured **HTTPS** (using Let's Encrypt) to ensure secure data transmission.

---

## 📸 Screenshots

|          Login Page          |       Admin Dashboard        |
| :--------------------------: | :--------------------------: |
| ![Login](你的登录图链接.jpg) | ![Admin](你的管理页链接.jpg) |

---

## ⚡️ How to Run (Locally)

1. **Clone the project**

   ```bash
   git clone [https://github.com/YourGithub/user-center-backend.git](https://github.com/YourGithub/user-center-backend.git)
   ```

2. **Run with Docker**

    ```bash
     docker-compose up -d
     ```

3. **Access** Open http://localhost:8000 in your browser.

------

## 📝 Learning Outcomes

Through this project, I learned:

- How to connect a Spring Boot backend with a React frontend.
- Basic Linux server commands (SSH, file management).
- How to use Docker Compose to manage database and application services together.
- How to configure a domain name and SSL certificate.

------

## 🚀 Future Improvements

While the current release focuses on establishing a solid manual deployment pipeline on Linux, I have identified several key areas for future optimization to align with DevOps best practices:

* [ ] **Testing Strategy**:
  * **Goal**: Increase code reliability by implementing Unit Tests (JUnit 5) for backend logic and Integration Tests for API endpoints.
* [ ] **Performance & Caching**:
  * **Goal**: Introduce **Redis** to manage user sessions and cache frequent database queries to reduce latency.
* [ ] **User Experience**:
  * **Goal**: Enhance the frontend with a responsive "User Profile" dashboard and "Forgot Password" functionality via email SMTP integration.

- [ ] **Automated CI/CD Pipeline**:

  * Currently, the project uses a manual Docker build process to understand the low-level deployment mechanics.

  * **Goal**: Integrate **Jenkins** to automate testing and deployment workflows.


