# Authentication & Authorization API

A Node.js + Express.js based REST API for user authentication and authorization using Supabase for user management and JWT for access control.


## 🚀 Features

- **User Registration & Login**  
  - Supabase authentication
  - Password hashing with bcrypt
  - Validation using Joi

- **JWT Authentication**  
  - Access & refresh token support
  - Automatic session refresh endpoint

- **Role-Based Access Control (RBAC)**  
  - `user` and `admin` roles
  - Middleware for route protection

- **Password Management**  
  - Forgot password endpoint
  - Reset password endpoint

- **Logout**  
  - Invalidates user session on logout


## 📂 Project Structure

```

src/
├── auth/
│   └── config/
│   ├── supabaseClient.js 
│   └── supabaseAdmin.js
│
│   ├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
|
|   └── middlewares/
│   ├── authenticationToken.js
│   ├── checkRole.js       
│   
│   ├── routes/
│   ├── admin.routes.js
│   ├── auth.routes.js
|
|   ├── utils/
│   └── jwt.js
|           
│   ├── validators/
│   ├── auth.validator.js      
│
└── app.js                

```


## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **Supabase** (Auth + Database)
- **JWT** for access control
- **bcrypt** for password hashing
- **Joi** for request validation


## ⚙️ Installation & Setup

1. Clone the repository:

```bash

git clone https:https://github.com/duraanos/Authentication-Authorization-API.git
cd auth-api

```

2. Install dependencies:

```bash

npm install

```

3. Create a .env file in the root directory:

```bash

PORT=3000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key


```
4. Start the server:

```bash

npm run dev

```


## 🧪 Testing with Postman

1. Import API endpoints into Postman.
2. Register a user via `/api/auth/register`.
3. Login via `/api/auth/login` → copy `access_token` & `refresh_token`.
4. Add `Authorization: Bearer <access_token>` header to test protected routes.
5. Test `/api/auth/refresh` with `refresh_token` to get new tokens.


## 🔐 Role-Based Access

- Default users are created with `role: user`.
- Admin privileges can be assigned manually via:
  - Supabase Admin client (`supabaseAdminClient.auth.admin.updateUserById`)
  - Or via `/api/auth/make-admin` endpoint by an existing admin.
