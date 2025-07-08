# Airports Portal

A modern Angular portal for airport management, featuring dark mode, role-based access, and internationalization (i18n) with ngx-translate.

---

## 🚀 Features

- **Dark Mode**: Toggleable, with smooth transitions and glassmorphism/gradient design.
- **Role-Based Access**: Admin, Editor, Author, and Viewer roles with granular permissions.
- **Internationalization**: English and Arabic support via ngx-translate.
- **Responsive UI**: Built with Bootstrap 5 and FontAwesome icons.
- **Charts & Analytics**: Integrated with Chart.js and ng2-charts.

---

## 👤 User Roles & Login

| Username | Roles Assigned         | Privileges (Access)                                                                                 |
|----------|-----------------------|-----------------------------------------------------------------------------------------------------|
| admin    | admin, editor         | Full access: Dashboard, News, Users, Statistics, Settings, Analytics, User Management, etc.         |
| any      | author                | Limited access: Dashboard, News (authoring), basic analytics.                                       |

- **Login Credentials**:  
  - Use `admin` as username (any password) for admin/editor access.
  - Any other username (any password) gets author access.
  - No real password validation (mock login).

---

## 🛡️ Allowed Directories/Routes by Role

| Route/Feature      | admin | editor | author | viewer |
|--------------------|:-----:|:------:|:------:|:------:|
| /dashboard         |   ✔   |   ✔    |   ✔    |   ✔    |
| /news              |   ✔   |   ✔    |   ✔    |        |
| /users             |   ✔   |   ✔    |        |        |
| /users/add         |   ✔   |        |        |        |
| /statistics        |   ✔   |   ✔    |        |        |
| /settings          |   ✔   |        |        |        |
| /analytics         |   ✔   |        |        |        |

- **Note:** UI and route guards enforce these permissions.

---

## 🌐 Languages

- **English** (default)
- **Arabic**
- Switch languages from the header.

---

## 🖥️ Platform & Dependencies

- **Angular**: ^19.2.0
- **@ngx-translate/core**: ^16.0.4
- **Bootstrap**: ^5.3.7
- **FontAwesome**: ^6.7.2
- **Chart.js**: ^4.5.0
- **ng2-charts**: ^8.0.0

---

## ⚙️ Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/airports-portal.git
   cd airports-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm start
   ```
   - App runs at `http://localhost:4200/`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

---

## 📁 Project Structure

- `src/app/core/` – Core services, guards, models
- `src/app/features/` – Feature modules (auth, dashboard, news, users, statistics)
- `src/app/shared/` – Shared UI components (header, sidebar, cards, etc.)
- `src/environments/` – Environment configs

---

## 📝 Notes

- This project uses a mock authentication system for demonstration.
- For real-world use, integrate with a backend API and secure authentication.

---

## 📣 License

MIT
