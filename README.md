# Project to Quote (P2Q)

[![Laminas](https://img.shields.io/badge/Laminas-Framework-blue)](https://getlaminas.org/)  
[![React](https://img.shields.io/badge/React-JS-blue)](https://reactjs.org/)  
[![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-green)](https://www.microsoft.com/en-us/sql-server)

---

## Description

**Project to Quote (P2Q)** is an internal web application for Centura, designed to streamline opportunity and project management for architect representatives.  

Features include:

- Keep and manage opportunity records.
- Convert awarded opportunities into projects.
- Generate quotes from projects when needed.
- Submit quotes for manager approval.
- Partial migration of controllers from traditional Laminas MVC (`phtml`) to Inertia.js with React.

---

## Tech Stack

- **Backend:** Laminas MVC, Laminas\Db  
- **Frontend:** React, Inertia.js  
- **Database:** SQL Server  
- **Server:** IIS (Windows Server)

---

## Installation & Setup

> Note: This is an internal company project. Database access is restricted to Centura's internal network.

1. Clone the repository:

```bash
git clone <repository-url>
cd project-to-quote
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install frontend dependencies:
```bash
npm install
```

4. Configure application settings:
- Update config/autoload/global.php or config/autoload/local.php with your environment-specific settings (database, email, etc.).

5. Deploy on IIS:
- Set up a site in IIS pointing to the public folder of the project.
- Ensure URL Rewrite module is enabled for clean URLs.

---

## Usage
- Access the web app via your browser.
- Use architect rep accounts to manage opportunities and projects.
- Managers can approve submitted quotes.

---

## Current Development Notes
- Some controllers have been converted to use Inertia.js and React, replacing legacy .phtml templates.
- Further migration is ongoing.

---

## Contributing
This is an internal company project. Contributions are managed by the Centura development team.

---

## License
This project is proprietary and belongs to Centura.
  
