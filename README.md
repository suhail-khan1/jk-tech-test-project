# jk-tech-test-project

# Backend

This project is a Node.js backend built with **TypeScript**. It includes services for:

- **Authentication** (JWT-based)
- **User Management** (roles: admin, editor, viewer)
- **Document Management** (CRUD + upload)
- **Ingestion Management** (triggering and tracking ingestion jobs)

Each service is modular, with separate controller, route, model, and test files.

---

## Project Structure

|--- auth/                # Authentication service
│   |--- controller/
│   |--- routes/
│   |--- model/
│   |--- tests/
|--- user/                # User management service
│   |--- controller/
│   |--- routes/
│   |--- model/
│   |--- tests/
|--- document/            # Document management service
│   |--- controller/
│   |--- routes/
│   |--- model/
│   |--- tests/
|--- ingestion/           # Ingestion management service
│   |--- controller/
│   |--- routes/
│   |--- model/
│   |--- tests/
|--- middleware/          # middlewares (e.g., auth)
|--- utils/               # Utility functions
|--- uploads/documents    # upload document folder
|--- config/              # Configuration files (MongoDB, environment)
|--- server.ts            # App entry point
|--- spec/support         # Contains configuration in the jasmine json file to run the test
|--- .env                 # Environment variables
|--- tsconfig.json        # TypeScript config
|--- package.json         # Dependencies, script
|--- README.md

---

## Setup Instructions

### 1.Clone the Repository

git clone https://github.com/suhail-khan1/management-system.git
cd management-system/backend

### 2. Install Dependencies

npm install

---

## Running the Application
npm start

Or with **nodemon**:

nodemon server.ts


### Production Build

## Compile TypeScript:

npm run build

Start compiled JS:

npm start

---

## Running Tests

This project uses **JasmineJS** for unit testing.

### To run all test cases:

npm test

---

## Technologies Used

- **Node.js** + **ExpressJS**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **JasmineJS** for unit testing

---

## Services Summary

| Service      | Description                              | Folder       |
|--------------|------------------------------------------|--------------|
| Auth         | Register, login, logout, role handling   | `auth/`      |
| User         | Admin role/user management               | `user/`      |
| Document     | CRUD + upload support                    | `document/`  |
| Ingestion    | Trigger/track ingestion jobs             | `ingestion/` |


# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
