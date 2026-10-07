# Mini Blog API

A REST API for a blog, built with Express, MongoDB, and JWT auth.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the values
3. `npm run dev`

## Auth
- POST /auth/signup — { name, email, password }
- POST /auth/login — { email, password } → { token, user }

## Posts
- GET /posts?page=&limit=
- GET /posts/:id
- POST /posts/create (auth required) — { title, content }
- PATCH /posts/:id (auth required, owner only)
- DELETE /posts/:id (auth required, owner only)

## Notes
- Ownership checks: only the post's author can update/delete it
- Errors go through a global error handler, consistent `{ message }` shape