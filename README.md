<div align="center">

# 🎵 MyMusic Backend

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=MyMusic+NestJS+Backend;Spring+Boot+%E2%86%92+NestJS+Migration;REST+API+%2B+JWT+%2B+Cloudinary" alt="Typing SVG" />

<br/>

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

<br/>

> **A full-featured music streaming REST API** — migrated from Spring Boot 3.3.5 (Java 17) to NestJS (TypeScript).
> Supports JWT auth, premium subscriptions via VNPay, Cloudinary uploads, and real-time search.

<br/>

[🚀 Quick Start](#-quick-start) •
[📖 API Docs](#-api-reference) •
[🏗️ Architecture](#️-architecture) •
[🔐 Auth Flow](#-authentication) •
[⚙️ Configuration](#️-environment-variables)

</div>

---

## ✨ Features

<table>
<tr>
<td>

🔐 **Authentication & Security**
- JWT HS512 access + refresh tokens
- Token blacklisting on logout
- BCrypt password hashing
- Role & Permission based access control

</td>
<td>

🎶 **Music Management**
- Songs, Albums, Artists, Genres
- Playlists with creator assignment
- Listener & follower counters
- Advanced search with operators

</td>
</tr>
<tr>
<td>

💳 **Premium Subscriptions**
- VNPay payment gateway
- 4 premium plan tiers
- Auto-expiry via cron jobs
- Payment confirmation emails

</td>
<td>

☁️ **Media & Communication**
- Cloudinary image & audio upload
- Gmail SMTP email service
- Welcome & OTP email templates
- File metadata storage

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | NestJS 10 + TypeScript 5 |
| **Runtime** | Node.js 20+ |
| **Database** | MySQL 8.0 + TypeORM |
| **Auth** | Passport.js + JWT (HS512) |
| **Storage** | Cloudinary v2 |
| **Payment** | VNPay HMAC-SHA512 |
| **Email** | Nodemailer + Gmail SMTP |
| **Validation** | class-validator + class-transformer |
| **Docs** | Swagger / OpenAPI 3 |
| **Scheduler** | @nestjs/schedule (Cron) |
| **Testing** | Jest + Supertest |

---

## 🚀 Quick Start

### Prerequisites

- Node.js `>= 20`
- MySQL `>= 8.0`
- npm or pnpm

### 1 · Clone & Install

```bash
git clone <your-repo-url>
cd backend
npm install
```

### 2 · Configure Environment

```bash
cp .env.example .env
```

> See [⚙️ Environment Variables](#️-environment-variables) for full reference.

### 3 · Create Database

```sql
CREATE DATABASE mymusic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 4 · Start the Server

```bash
# 🔥 Development (watch mode)
npm run start:dev

# 🏭 Production
npm run build && npm run start:prod
```

| URL | Description |
|---|---|
| `http://localhost:8080/mymusic` | API Base URL |
| `http://localhost:8080/swagger-ui` | Interactive API Docs |

---

## ⚙️ Environment Variables

```env
# ── Database ──────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=mymusic

# ── JWT (minimum 64 characters each) ─────────────
JWT_SIGNER_KEY=your_super_secret_access_key_min_64_chars_here_xxxxxxxxxxxxxxxx
JWT_REFRESH_KEY=your_super_secret_refresh_key_min_64_chars_here_xxxxxxxxxxxxxxx
JWT_RESET_KEY=your_super_secret_reset_key_min_64_chars_here_xxxxxxxxxxxxxxxxxx
JWT_ACCESS_EXPIRY_MINUTES=15
JWT_REFRESH_EXPIRY_DAYS=20
JWT_RESET_EXPIRY_MINUTES=15

# ── Cloudinary ────────────────────────────────────
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER_IMAGE=mymusic/images
CLOUDINARY_FOLDER_VIDEO=mymusic/videos

# ── VNPay ─────────────────────────────────────────
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECRET_KEY=your_vnpay_secret
VNPAY_RETURN_URL=http://localhost:8080/mymusic/v1/payment/vn-pay-callback

# ── Email (Gmail SMTP) ────────────────────────────
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_app_password

# ── Server ────────────────────────────────────────
PORT=8080
```

---

## 📖 API Reference

> All responses follow this envelope format:
>
> ```json
> { "code": 200, "message": "Success", "result": { ... } }
> ```

### 🔐 Auth — `/v1/auth`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/login` | 🌐 | Login with email & password |
| `POST` | `/register` | 🌐 | Create account |
| `POST` | `/refresh-token` | 🌐 | Renew access token |
| `POST` | `/logout` | 🌐 | Invalidate token |
| `GET` | `/myInfo` | 🔒 | Get current user profile |
| `POST` | `/change-password` | 🔒 | Update password |
| `POST` | `/forgot-password` | 🌐 | Send OTP to email |
| `POST` | `/forgot-password/verify-code` | 🌐 | Verify OTP |
| `POST` | `/forgot-password/reset-password` | 🌐 | Set new password |
| `GET` | `/stats` | 🔒 | Platform statistics |

### 🎵 Songs — `/v1/songs`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/` | 🔒 | Create song |
| `GET` | `/` | 🌐 | List all songs (paginated) |
| `GET` | `/:id` | 🌐 | Get song · increments listener |
| `GET` | `/search` | 🌐 | Search with filters |
| `PUT` | `/:id` | 🔒 | Update song |
| `DELETE` | `/:id` | 🔒 | Delete song |

### 💿 Albums — `/v1/albums`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/` | 🔒 | Create album |
| `GET` | `/` | 🌐 | List all albums (paginated) |
| `GET` | `/:id` | 🌐 | Get album · increments follower |
| `GET` | `/search` | 🌐 | Search with filters |
| `PUT` | `/:id` | 🔒 | Update album |
| `DELETE` | `/:id` | 🔒 | Delete album + all its songs |
| `DELETE` | `/:albumId/songs/:songId` | 🔒 | Remove song from album |

### 🎤 Artists — `/v1/artists`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/` | 🔒 | Create artist |
| `GET` | `/` | 🌐 | List all artists (paginated) |
| `GET` | `/:id` | 🌐 | Get artist · increments follower |
| `GET` | `/search` | 🌐 | Search with filters |
| `PUT` | `/:id` | 🔒 | Update artist |
| `DELETE` | `/:id` | 🔒 | Delete artist |

### 🎼 Playlists — `/v1/playlists`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/` | 🔒 | Create playlist (auto-assigns creator) |
| `GET` | `/` | 🌐 | List all playlists (paginated) |
| `GET` | `/:id` | 🌐 | Get playlist · increments follower + listener |
| `GET` | `/search` | 🌐 | Search with filters |
| `PUT` | `/:id` | 🔒 | Update playlist |
| `DELETE` | `/:id` | 🔒 | Delete playlist |
| `DELETE` | `/:playlistId/songs/:songId` | 🔒 | Remove song from playlist |

### 👤 Users — `/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/` | 🔒 | Create user |
| `GET` | `/` | 🔒 | List all users (paginated) |
| `GET` | `/:id` | 🔒 | Get user by ID |
| `PUT` | `/:id` | 🔒 | Update user |
| `DELETE` | `/:id` | 🔒 | Delete user |
| `POST` | `/saved-playlist/:playlistId` | 🔒 | Save a playlist |
| `GET` | `/saved-playlists` | 🔒 | Get saved playlists |
| `DELETE` | `/saved-playlist/:playlistId` | 🔒 | Unsave a playlist |

### 💳 Payment — `/v1/payment`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/vn-pay` | 🔒 | Generate VNPay payment URL |
| `POST` | `/vn-pay-callback` | 🌐 | VNPay result callback |
| `GET` | `/premium-status` | 🔒 | Check user premium status |

### 🔎 Other Endpoints

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/v1/search-by-priority` | 🌐 | Cross-entity search |
| `GET` | `/v1/genres` | 🌐 | List genres |
| `GET` | `/v1/genres/:genreId/songs` | 🌐 | Songs by genre |
| `POST` | `/v1/files/upload?fileType=IMAGE` | 🔒 | Upload image |
| `POST` | `/v1/files/upload?fileType=VIDEO` | 🔒 | Upload audio/video |
| `GET` | `/v1/files` | 🔒 | List all files |
| `DELETE` | `/v1/files/:id` | 🔒 | Delete file from Cloudinary |

> 🌐 = Public &nbsp;&nbsp; 🔒 = Requires Bearer Token

---

## 🔐 Authentication

```
┌─────────┐     POST /auth/login      ┌─────────────┐
│  Client │ ─────────────────────────► │   Server    │
│         │ ◄──── { accessToken,       │             │
│         │         refreshToken } ─── │  HS512 JWT  │
└─────────┘                           └─────────────┘
     │
     │  Authorization: Bearer <accessToken>
     ▼
┌─────────────────────────────────────────────────────┐
│  Every protected request                            │
│  1. Verify HS512 signature                          │
│  2. Check token expiry                              │
│  3. Check jti not in blacklist (tbl_invalidated)    │
│  4. Extract scope → ROLE_USER CREATE_SONG ...       │
└─────────────────────────────────────────────────────┘
```

### Token Lifetimes

| Token | Expiry | Storage |
|---|---|---|
| Access Token | 15 minutes | Client only |
| Refresh Token | 20 days | `tbl_refresh_token` |
| Reset Token | 15 minutes | `tbl_forgot_password_token` |

---

## 🔎 Search Syntax

Search endpoints accept filter arrays in the query string:

```bash
# Find songs with "Rock" in name AND listener count > 1000
GET /v1/songs/search?search=name~Rock&search=listener>1000

# Find albums with "2024" in name AND totalTracks < 20
GET /v1/albums/search?search=name~2024&search=totalTracks<20
```

| Operator | Behaviour | Example |
|---|---|---|
| `~` | `LIKE %value%` (contains) | `name~Rock` |
| `>` | Greater than | `listener>5000` |
| `<` | Less than | `duration<200` |

---

## 💳 Premium Plans

```
 ┌─────────────┬─────────────┬──────────────┬──────────────┐
 │  1 Month    │  3 Months   │  6 Months    │  12 Months   │
 │  30,000 ₫  │  79,000 ₫  │  169,000 ₫  │  349,000 ₫  │
 └─────────────┴─────────────┴──────────────┴──────────────┘
```

On successful payment:
1. User role → `PREMIUM`
2. `premiumStatus = true`
3. `premiumExpiryDate` set based on plan
4. Confirmation email sent

---

## 🏗️ Architecture

```
src/
├── 📄 main.ts                    # Bootstrap — CORS, global prefix, Swagger
├── 📄 app.module.ts              # Root module — TypeORM, MailerModule, Guards
│
├── 📁 common/
│   ├── decorators/               # @Public  @CurrentUser  @Roles  @Permissions
│   ├── enums/                    # RoleEnum  FileType  ErrorCode
│   ├── exceptions/               # AppException (wraps HTTP status + message)
│   ├── filters/                  # GlobalExceptionFilter → { code, message, null }
│   ├── guards/                   # JwtAuthGuard  RolesGuard
│   └── interceptors/             # ResponseInterceptor → { code, message, result }
│
├── 📁 dto/
│   ├── basic/                    # ArtistBasic  SongBasic  AlbumBasic  UserBasic
│   ├── request/                  # AuthRequest  SongRequest  PlaylistRequest …
│   └── response/                 # TokenResponse  PageResponse<T>  ApiResponse<T>
│
└── 📁 modules/
    ├── auth/                     # Login · Register · JWT Strategy · Entities
    ├── token/                    # Token service · Blacklist · Refresh tokens
    ├── user/                     # CRUD · Saved playlists
    ├── song/                     # CRUD · Search · Listener counter
    ├── album/                    # CRUD · Search · Follower counter · Cascade delete
    ├── artist/                   # CRUD · Search · Follower counter
    ├── genre/                    # CRUD
    ├── playlist/                 # CRUD · Search · Creator auto-assign · Counters
    ├── payment/                  # VNPay · Premium management · Callback handler
    ├── file/                     # Cloudinary upload · Image & Audio validation
    ├── role/                     # CRUD
    ├── permission/               # CRUD
    ├── mail/                     # Welcome · OTP · Payment confirmation emails
    ├── search/                   # Cross-entity priority search
    └── schedule/                 # Cron: token cleanup · premium expiry · OTP cleanup
```

---

## 🗄️ Database Schema

| Entity | Table | Key Relations |
|---|---|---|
| `User` | `tbl_user` | M2M → Role, M2M → Playlist (saved) |
| `Role` | `tbl_role` | M2M → Permission |
| `Permission` | `tbl_permission` | — |
| `Song` | `tbl_song` | M2O → Album, M2M → Artist, M2O → Genre |
| `Album` | `tbl_album` | M2M → Artist, O2M → Song |
| `Artist` | `tbl_artist` | M2M → Song, M2M → Album |
| `Genre` | `tbl_genre` | O2M → Song |
| `Playlist` | `tbl_playlist` | M2O → User (creator), M2M → Song |
| `FileEntity` | `tbl_file` | — |
| `RefreshToken` | `tbl_refresh_token` | — |
| `InvalidatedToken` | `tbl_invalidated_token` | — |
| `ForgotPasswordToken` | `tbl_forgot_password_token` | — |
| `VerificationCode` | `tbl_verification_code` | — |

---

## ⏰ Scheduled Tasks

| Task | Schedule | Action |
|---|---|---|
| Refresh token cleanup | `0 0 * * *` — Daily midnight | `DELETE` expired refresh tokens |
| Premium expiry check | `0 * * * *` — Every hour | Downgrade expired premium → `USER` role |
| Verification code cleanup | `0 * * * *` — Every hour | `DELETE` expired OTP codes |

---

## 🌱 Database Seed

After first run (tables auto-created via `synchronize: true`), seed base data:

```bash
# 1. Create permissions
curl -X POST http://localhost:8080/mymusic/v1/permissions \
  -H "Content-Type: application/json" \
  -d '{"name":"CREATE_SONG","description":"Can create songs"}'

# 2. Create roles
curl -X POST http://localhost:8080/mymusic/v1/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"USER","description":"Default user","permissionIds":[]}'

curl -X POST http://localhost:8080/mymusic/v1/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"PREMIUM","description":"Premium user","permissionIds":[]}'

curl -X POST http://localhost:8080/mymusic/v1/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"ADMIN","description":"Administrator","permissionIds":[1]}'
```

---

## 📜 Scripts

```bash
npm run start:dev     # 🔥 Start in watch mode
npm run build         # 📦 Compile TypeScript → dist/
npm run start:prod    # 🚀 Run production build
npm run test          # 🧪 Run unit tests
npm run test:e2e      # 🔬 Run end-to-end tests
npm run test:cov      # 📊 Coverage report
npm run lint          # 🔍 ESLint check + auto-fix
npm run format        # ✨ Prettier format
```

---

<div align="center">

Made with ❤️ using **NestJS** + **TypeScript**

[![NestJS](https://img.shields.io/badge/Powered%20by-NestJS-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeORM](https://img.shields.io/badge/ORM-TypeORM-FE0803?style=flat-square)](https://typeorm.io/)
[![MySQL](https://img.shields.io/badge/DB-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>
