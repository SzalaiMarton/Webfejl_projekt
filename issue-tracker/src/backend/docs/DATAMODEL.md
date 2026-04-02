# Issue Tracker - Adatmodell

## 1. Entitások áttekintése

Az alkalmazás az alábbi 5+ önálló entitást kezeli, amelyek logikus kapcsolatban állnak egymással:

### 1.1 User (Felhasználó)
**Leírás:** Az alkalmazás felhasználói, akik projekteket kezelhetnek és issue-kat hozhatnak létre.

```javascript
{
  id: "uuid",
  username: "string",
  email: "string",
  password: "string (hashed)",
  avatar: "string (url)",
  role: "admin" | "user",
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

**Kapcsolatok:**
- Projekt tulajdonoseként (1-N: User → Project)
- Issue létrehozójaként (1-N: User → Issue)
- Comment szerzőjeként (1-N: User → Comment)

---

### 1.2 Project (Projekt)
**Leírás:** A problémakörnyezet/feladat kategória, amely issue-kat csoportosít.

```javascript
{
  id: "uuid",
  name: "string",
  description: "string",
  ownerId: "uuid (User)",
  status: "active" | "archived" | "completed",
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

**Kapcsolatok:**
- Tulajdonos: User (N-1: Project → User)
- Tartalmaz: Issue-kat (1-N: Project → Issue)
- Tartalmaz: Label-eket (1-N: Project → Label)

---

### 1.3 Issue (Probléma/Feladat)
**Leírás:** Egy konkrét feladat vagy hiba, amely egy projekthez tartozik és nyomon követhető.

```javascript
{
  id: "uuid",
  projectId: "uuid (Project)",
  title: "string",
  description: "string",
  createdById: "uuid (User)",
  assignedToId: "uuid (User) | null",
  priority: "low" | "medium" | "high" | "critical",
  status: "open" | "in_progress" | "blocked" | "resolved" | "closed",
  labels: ["uuid (Label)"]  // Array of label IDs
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

**Kapcsolatok:**
- Projekt: Project (N-1: Issue → Project)
- Létrehozta: User (N-1: Issue → User)
- Hozzárendelve: User (N-1: Issue → User, optional)
- Tartalmaz: Comment-eket (1-N: Issue → Comment)
- Tartalmaz: Label-eket (N-M: Issue ↔ Label)
- Tartalmaz: Attachment-eket (1-N: Issue → Attachment)

---

### 1.4 Comment (Hozzászólás)
**Leírás:** Egy issue-hoz kapcsolódó visszajelzés vagy megjegyzés.

```javascript
{
  id: "uuid",
  issueId: "uuid (Issue)",
  authorId: "uuid (User)",
  content: "string",
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

**Kapcsolatok:**
- Issue: Issue (N-1: Comment → Issue)
- Szerző: User (N-1: Comment → User)
- Tartalmaz: Attachment-eket (1-N: Comment → Attachment, optional)

---

### 1.5 Label (Címke/Kategória)
**Leírás:** Az issue-k kategorizálásához és szűréséhez használt címkék.

```javascript
{
  id: "uuid",
  projectId: "uuid (Project)",
  name: "string",
  color: "string (hex colour)",
  description: "string",
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

**Kapcsolatok:**
- Projekt: Project (N-1: Label → Project)
- Használt: Issue-kban (N-M: Label ↔ Issue)

---

### 1.6 Attachment (Melléklet)
**Leírás:** Fájlok és média az issue-khoz és comment-ekhez.

```javascript
{
  id: "uuid",
  issueId: "uuid (Issue) | null",
  commentId: "uuid (Comment) | null",
  fileName: "string",
  fileUrl: "string",
  fileSize: "number",
  mimeType: "string",
  uploadedAt: "ISO date"
}
```

**Kapcsolatok:**
- Issue: Issue (N-1: optional)
- Comment: Comment (N-1: optional)

---

## 2. Entitások közötti kapcsolatok (ER Diagram logikája)

```
User
├─ 1:N → Project (ownerId)
├─ 1:N → Issue (createdById, assignedToId)
└─ 1:N → Comment (authorId)

Project
├─ N:1 → User (ownerId)
├─ 1:N → Issue
├─ 1:N → Label
└─ 1:N → Attachment (közvetett)

Issue
├─ N:1 → Project
├─ N:1 → User (createdById)
├─ N:1 → User (assignedToId, optional)
├─ 1:N → Comment
├─ N:M → Label
└─ 1:N → Attachment

Comment
├─ N:1 → Issue
├─ N:1 → User (authorId)
└─ 1:N → Attachment

Label
├─ N:1 → Project
└─ N:M → Issue

Attachment
├─ N:1 → Issue (kondicionális)
└─ N:1 → Comment (kondicionális)
```

---

## 3. CRUD Műveletek Implementációja

### Teljes CRUD (2 entitás):
- **Project**: CREATE, READ, UPDATE, DELETE
- **Issue**: CREATE, READ, UPDATE, DELETE

### Read Operations (3+ entitás):
- **User**: READ (login, profile)
- **Comment**: READ, CREATE, DELETE (az issue kontextusában)
- **Label**: READ, CREATE, DELETE

---

## 4. Adatperzisztencia

Az alkalmazás a backend szerverben tárolt **JSON fájlokat** használ az adatok mentéséhez:

- `data/users.json` - Felhasználók
- `data/projects.json` - Projektek
- `data/issues.json` - Issue-k
- `data/comments.json` - Hozzászólások
- `data/labels.json` - Címkék
- `data/attachments.json` - Mellékletek

**Perzisztencia stratégia:**
- Az adatbázis fájlok szinkronban tartódnak a memóriával
- Minden írási művelet után az adatok azonnal fájlba kerülnek
- Az alkalmazás induláskor betölti az összes adatot a fájlokból

---

## 5. REST API Végpontok

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Felhasználó regisztrálása
- `POST /api/auth/login` - Bejelentkezés
- `GET /api/auth/me` - Aktuális felhasználó adatai

### Projects (`/api/projects`)
- `GET /api/projects` - Összes projekt listázása
- `GET /api/projects/:id` - Proyecto adatai
- `POST /api/projects` - Új projekt létrehozása
- `PATCH /api/projects/:id` - Projekt módosítása
- `DELETE /api/projects/:id` - Projekt törlése

### Issues (`/api/issues`)
- `GET /api/issues` - Összes issue listázása (szűrés, keresés, rendezés)
- `GET /api/issues/:id` - Issue-k adatai
- `POST /api/issues` - Új issue létrehozása
- `PATCH /api/issues/:id` - Issue módosítása
- `DELETE /api/issues/:id` - Issue törlése

### Comments (`/api/comments`)
- `GET /api/issues/:issueId/comments` - Issue-hoz kapcsolódó comment-ek
- `POST /api/issues/:issueId/comments` - Comment hozzáadása
- `PATCH /api/comments/:id` - Comment módosítása
- `DELETE /api/comments/:id` - Comment törlése

### Labels (`/api/labels`)
- `GET /api/labels` - Összes label listázása
- `POST /api/labels` - Új label létrehozása
- `DELETE /api/labels/:id` - Label törlése

---

## 6. Validáció és Biztonság

- Email és username validáció (regex alapú)
- Szükséges mezők ellenőrzése
- Azonosság megerősítés (authMiddleware)
- Hiba kezelés (errorHandler middleware)

---

Verzió: 1.0 | Utolsó frissítés: 2026-04-02
