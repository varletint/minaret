# Minaret Live - Backend API Documentation

> **Mosque Live Audio Streaming Platform**  
> Mosques broadcast live prayers, lectures & sermons. Anyone can listen without an account.

---

## Overview

| User Type    | Account Required | Can Do                                                  |
| ------------ | ---------------- | ------------------------------------------------------- |
| **Listener** | ❌ No            | Browse mosques, listen to live streams                  |
| **Mosque**   | ✅ Yes           | Create account, manage profile, go live, schedule shows |

---

## Base Configuration

```
Base URL: /api/v1
Auth: JWT (Access Token in header, Refresh Token in httpOnly cookie)
Content-Type: application/json
```

---

## 🔐 Authentication (`/auth`)

> Only for **Mosque accounts**

| Method | Endpoint         | Auth | Description                |
| ------ | ---------------- | ---- | -------------------------- |
| POST   | `/auth/register` | ❌   | Register mosque account    |
| POST   | `/auth/login`    | ❌   | Login                      |
| POST   | `/auth/refresh`  | 🍪   | Refresh access token       |
| POST   | `/auth/logout`   | ✅   | Logout                     |
| GET    | `/auth/me`       | ✅   | Get current mosque account |

### POST `/auth/register`

**Request:**

```json
{
  "username": "string (mosque name, required)",
  "email": "string (required, unique)",
  "password": "string (required, min 8 chars)"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": { "id", "username", "email", "role", "createdAt", "updatedAt" },
    "accessToken": "string"
  }
}
```

### POST `/auth/login`

**Request:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):** Same as register + sets `refreshToken` httpOnly cookie

### POST `/auth/refresh`

Uses httpOnly cookie. No body needed.

**Response (200):**

```json
{
  "success": true,
  "data": { "accessToken": "string" }
}
```

### GET `/auth/me`

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": { "id", "username", "email", "role", "createdAt", "updatedAt" }
  }
}
```

---

## 🕌 Mosques/Stations (`/stations`)

> "Station" = Mosque's broadcast channel

| Method | Endpoint                        | Auth | Description                       |
| ------ | ------------------------------- | ---- | --------------------------------- |
| GET    | `/stations`                     | ❌   | List all mosques (public)         |
| GET    | `/stations/live`                | ❌   | List currently live mosques       |
| GET    | `/stations/:id`                 | ❌   | Get mosque detail                 |
| GET    | `/stations/my`                  | ✅   | Get logged-in mosque's station    |
| POST   | `/stations`                     | ✅   | Create station (first time setup) |
| PATCH  | `/stations/:id`                 | ✅   | Update mosque profile             |
| POST   | `/stations/:id/broadcast/start` | ✅   | Go live                           |
| POST   | `/stations/:id/broadcast/stop`  | ✅   | Stop broadcast                    |

### Station Object

```typescript
interface Station {
  id: string;
  name: string;
  description: string;
  logo?: string;
  streamUrl?: string;
  location?: string; // e.g., "Kontagora, Niger State"
  isLive: boolean;
  listenerCount?: number; // Current listeners
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### GET `/stations?page=1&limit=10`

**Query params:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `live` - Filter live only (optional: true/false)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "stations": [Station],
    "pagination": { "page", "limit", "total", "totalPages" }
  }
}
```

### GET `/stations/live`

Returns only currently broadcasting mosques.

### POST `/stations` (First-time setup)

**Request:**

```json
{
  "name": "string (mosque name)",
  "description": "string",
  "logo": "string (URL, optional)",
  "location": "string",
  "streamUrl": "string (optional)"
}
```

---

## 🎙️ Shows/Broadcasts (`/shows`)

> Scheduled broadcasts (Friday prayers, lectures, etc.)

| Method | Endpoint                 | Auth | Description             |
| ------ | ------------------------ | ---- | ----------------------- |
| GET    | `/shows`                 | ❌   | List all shows (public) |
| GET    | `/shows/:id`             | ❌   | Get show detail         |
| GET    | `/stations/:id/shows`    | ❌   | Get shows by mosque     |
| GET    | `/stations/:id/schedule` | ❌   | Get mosque schedule     |
| POST   | `/shows`                 | ✅   | Create show             |
| PATCH  | `/shows/:id`             | ✅   | Update show             |
| DELETE | `/shows/:id`             | ✅   | Delete show             |

### Show Object

```typescript
interface Show {
  id: string;
  title: string; // e.g., "Jumu'ah Prayer"
  description: string;
  thumbnail?: string;
  stationId: string;
  startTime: string; // ISO datetime
  endTime: string;
  isRecurring: boolean;
  recurringDays?: number[]; // 0=Sun, 5=Fri, etc.
  createdAt: string;
  updatedAt: string;
}
```

### POST `/shows`

**Request:**

```json
{
  "title": "Jumu'ah Prayer",
  "description": "Weekly Friday prayer",
  "stationId": "string",
  "startTime": "2026-01-24T13:00:00Z",
  "endTime": "2026-01-24T14:00:00Z",
  "isRecurring": true,
  "recurringDays": [5]
}
```

---

## 🔍 Search (`/search`) - Suggested

| Method | Endpoint          | Auth | Description                     |
| ------ | ----------------- | ---- | ------------------------------- |
| GET    | `/search?q=query` | ❌   | Search mosques by name/location |

**Response:**

```json
{
  "success": true,
  "data": {
    "stations": [Station]
  }
}
```

---

## 📊 Standard Responses

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": ["error1", "error2"] }
}
```

### HTTP Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 201  | Created          |
| 400  | Validation error |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 404  | Not Found        |
| 500  | Server Error     |

---

## 📁 Database Schema

```
users (Mosque Accounts)
├── id (PK)
├── username (mosque name)
├── email (unique)
├── password (hashed)
├── role (default: "mosque")
├── createdAt
└── updatedAt

stations (Mosque Broadcast Channels)
├── id (PK)
├── name
├── description
├── logo
├── location
├── streamUrl
├── isLive
├── listenerCount
├── ownerId (FK → users, unique 1:1)
├── createdAt
└── updatedAt

shows (Scheduled Broadcasts)
├── id (PK)
├── title
├── description
├── thumbnail
├── stationId (FK → stations)
├── startTime
├── endTime
├── isRecurring
├── recurringDays (JSON)
├── createdAt
└── updatedAt
```

---

## ✅ Implementation Status

### ✅ Done

- [x] Auth (register, login, refresh, logout, me)
- [x] Stations CRUD
- [x] Shows CRUD
- [x] Broadcast start/stop

### 📋 To Add

- [ ] GET `/stations/live` - Filter live mosques
- [ ] `location` field on stations
- [ ] `listenerCount` tracking
- [ ] Search endpoint

---

_Minaret Live - Connecting Muslims to their mosques worldwide_ 🕌
