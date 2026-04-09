# Issue Tracker Backend

Teljes értékű backend API az issue tracking alkalmazáshoz.

## Technológia Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON** - File-based persistence (data/\*.json)
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## Projekt Struktura

```
backend/
├── server.js                 # Alkalmazás entry point
├── package.json             # Dependenciák
├── .env                     # Konfigurációs fájl
│
├── src/
│   ├── models/              # Adatmodell osztályok
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Issue.js
│   │   ├── Comment.js
│   │   ├── Label.js
│   │   └── Attachment.js
│   │
│   ├── services/            # Business Logic réteg
│   │   ├── DatabaseService.js      # JSON fájl kezelés, CRUD ops
│   │   ├── UserService.js          # Felhasználó logika
│   │   ├── ProjectService.js       # Projekt logika
│   │   ├── IssueService.js         # Issue logika (szűrés, keresés)
│   │   ├── CommentService.js       # Comment logika
│   │   └── LabelService.js         # Label logika
│   │
│   ├── routes/              # REST API routes (végpontok)
│   │   ├── authRoutes.js           # Auth: register, login, me
│   │   ├── projectRoutes.js        # Project CRUD + listázás
│   │   ├── issueRoutes.js          # Issue CRUD + szűrés/keresés
│   │   ├── commentRoutes.js        # Comment CRUD
│   │   └── labelRoutes.js          # Label CRUD
│   │
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.js         # Központosított hiba kezelés
│   │   └── authMiddleware.js       # Hitelesítés (Bearer token)
│   │
│   └── utils/               # Segédfüggvények
│       ├── validators.js           # Input validáció
│       └── helpers.js              # Egyéb helper funkciók
│
├── data/                    # Persistent JSON adatfájlok
│   ├── users.json
│   ├── projects.json
│   ├── issues.json
│   ├── comments.json
│   ├── labels.json
│   └── attachments.json
│
└── docs/
    └── DATAMODEL.md        # Teljes dokumentáció
```

## Telepítés

### 1. Függőségek telepítése

```bash
cd src/backend
npm install
```

### 2. Szerver indítása

```bash
# Development módban (auto-restart)
npm run dev

# Production módban
npm start
```

A szerver elindul az **http://localhost:3000** porton.

## API Dokumentáció

### Authentication (`/api/auth`)

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "user": { ... },
  "token": "user-id"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Projects (`/api/projects`)

#### List All Projects
```bash
GET /api/projects
```

#### Get Project Details
```bash
GET /api/projects/:id
```

#### Create Project
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description"
}
```

#### Update Project
```bash
PATCH /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "active"
}
```

#### Delete Project
```bash
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Issues (`/api/issues`)

#### List Issues (with filters)
```bash
GET /api/issues?projectId=xxx&status=open&priority=high&search=bug&sortBy=createdAt&sortOrder=desc
```

#### Get Issue Details
```bash
GET /api/issues/:id
```

#### Create Issue
```bash
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project-id",
  "title": "Bug report",
  "description": "Detailed description",
  "priority": "high",
  "labels": ["label-id-1", "label-id-2"]
}
```

#### Update Issue
```bash
PATCH /api/issues/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "critical"
}
```

#### Assign Issue
```bash
PATCH /api/issues/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Delete Issue
```bash
DELETE /api/issues/:id
Authorization: Bearer <token>
```

### Comments (`/api/comments`)

#### Get Issue Comments
```bash
GET /api/comments/issue/:issueId
```

#### Create Comment
```bash
POST /api/comments/issue/:issueId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a comment"
}
```

#### Update Comment
```bash
PATCH /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment"
}
```

#### Delete Comment
```bash
DELETE /api/comments/:id
Authorization: Bearer <token>
```

### Labels (`/api/labels`)

#### List Labels
```bash
GET /api/labels
```

#### Get Project Labels
```bash
GET /api/labels/project/:projectId
```

#### Create Label
```bash
POST /api/labels
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project-id",
  "name": "Bug",
  "color": "#FF0000",
  "description": "Bug report"
}
```

#### Update Label
```bash
PATCH /api/labels/:id
Authorization: Bearer <token>
```

#### Delete Label
```bash
DELETE /api/labels/:id
Authorization: Bearer <token>
```

## Adatbázis Perzisztencia

Az alkalmazás **JSON fájlokat** használ az adatperzisztenciához:

- `data/users.json` - Felhasználók
- `data/projects.json` - Projektek
- `data/issues.json` - Issue-k
- `data/comments.json` - Hozzászólások
- `data/labels.json` - Címkék
- `data/attachments.json` - Mellékletek

Az adatok szinkronban tartódnak a memóriával, és minden írási operáció után azonnal fájlba mennek.

## Hitelesítés

Az alkalmazás **Bearer token** alapú hitelesítést használ:

```bash
Authorization: Bearer <user-id>
```

Valós alkalmazásban **JWT** tokent kellene használni.

## Hiba Kezelés

A backend központosított error handler middleware-t használ:

- **400** - Bad Request / Validációs hiba
- **401** - Unauthorized / Hitelesítési hiba
- **403** - Forbidden / Engedély nélkül
- **404** - Not Found
- **500** - Server Error

## Fejlesztés

### Adatbázis Reset

Az adatfájlok törlésével lehet resetelni az adatbázist. Indítás utána a backend új üres fájlokat fog létrehozni.

### Logging

A szerver konzolra naplózza a szükséges információkat (adatbázis inicializálás, requestek, hibák).

## API Teszt Tools

- **cURL** - Command line
- **Postman** - GUI tool
- **REST Client** - VS Code extension

## Verziózás

- **v1.0.0** - Teljes CRUD, szűrés, keresés, Autentikáció

---

**Dokumentáció:** Lásd: `docs/DATAMODEL.md` - Részletes adatmodell dokumentáció

Utolsó frissítés: 2026-04-02
