# Blogging Website

This is a simple example blogging platform built with Node.js and Express. It demonstrates basic functionality such as user registration, authentication, CRUD operations for posts, and commenting.

## Features

- User registration and login using JSON tokens
- Roles: admin, author, editor, reader
- CRUD endpoints for blog posts
- Simple commenting system
- Data stored locally in `data/db.json` using LowDB

## Setup

```bash
npm install
npm start
```

The server runs on `http://localhost:3000`.

## API Endpoints

- `POST /register` – register a new user `{ username, password, role }`
- `POST /login` – obtain auth token
- `GET /posts` – list posts
- `POST /posts` – create post (author/editor)
- `PUT /posts/:id` – update post
- `DELETE /posts/:id` – delete post
- `GET /posts/:id/comments` – list comments
- `POST /posts/:id/comments` – add comment

Authentication is done via `x-auth-token` header.

This project is a minimal skeleton and does not implement every feature described in the specification.
