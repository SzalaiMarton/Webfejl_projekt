# Frontend - Backend Integráció Guide

## Overview

A frontend (React + Vite) teljes mértékben integrálva van a backend API-val (Node.js + Express).

## Architecture

### Frontend Services (API Clients)
- `ApiService.js` - Osztalyú HTTP client (GET, POST, PATCH, DELETE)
- `AuthService.js` - Hitelesítés kezelés (login, register, logout)
- `ProjectService.js` - Projektek lekérése/módosítása
- `IssueService.js` - Issue-k lekérése/módosítása (szűrés, keresés)
- `CommentService.js` - Hozzászólások kezelése
- `LabelService.js` - Címkék kezelése

### Frontend Pages (API Integration)
- `LoginPage.jsx` - Bejelentkezés/Regisztráció az AuthService-en keresztül
- `DashboardPage.jsx` - Dashboard az API-ból lekért adatokkal
- `ProjectsPage.jsx` - Projektek listája az API-ból
- `ProjectDetailsPage.jsx` - Projekt részletei és issue-k
- `IssueDetailsPage.jsx` - Issue részletei és hozzászólások
- `CreateIssuePage.jsx` - Új issue létrehozása az API-n keresztül

## Setup Instructions

### 1. Backend Indítása

```bash
cd issue-tracker/src/backend
npm install
npm run dev

# Backend fut az http://localhost:3000 porton
```

### 2. Frontend Environment Configuration

A `.env` fájl már létezik az alábbi tartalommal:
```env
VITE_API_URL=http://localhost:3000/api
```

Ha a backend másik host-on/porton fut, módosítsd ezt az értéket.

### 3. Frontend Indítása

```bash
cd issue-tracker
npm install
npm run dev

# Frontend fut az http://localhost:5173 porton
```

## Workflow

### User Journey

1. **Login/Register**
   ```
   Frontend (LoginPage) -> AuthService.login() -> API /auth/login
   -> Token mentése localStorage-be
   -> Redirect /dashboard
   ```

2. **View Projects**
   ```
   Frontend (ProjectsPage) -> ProjectService.getAllProjects() -> API /projects
   -> Projects listázása az UI-ban
   ```

3. **View Issues**
   ```
   Frontend (ProjectDetailsPage) -> IssueService.getProjectIssues() 
   -> API /issues?projectId=X
   -> Issues megjelenítése
   ```

4. **Create Issue**
   ```
   Frontend (CreateIssuePage) 
   -> IssueService.createIssue(projectId, title, description, priority)
   -> API POST /issues
   -> Redirect /projects/:id
   ```

5. **View/Comment Issue**
   ```
   Frontend (IssueDetailsPage) 
   -> IssueService.getIssueById() -> API /issues/:id
   -> CommentService.getIssueComments() -> API /comments/issue/:id
   -> Comments megjelenítése és szerkesztése
   ```

6. **Logout**
   ```
   Frontend (Navbar) -> AuthService.logout()
   -> Token törlése localStorage-ből
   -> Redirect /login
   ```

## API Authentication

Minden API request automatikusan Bearer token-t küld az authorization header-ben:

```javascript
// ApiService.js getAuthHeaders()
Authorization: Bearer <token>
```

A token a **localStorage**-ben tárolódik az alábbi kulcs alatt:
- `token` - Az API token (user ID, valós alkalmazásban JWT)
- `user` - A felhasználó adatai (JSON string)

## Error Handling

### Frontend Error Types

1. **Network Errors** - Szerver nem elérhető
   ```javascript
   try {
     const data = await ApiService.get('/projects');
   } catch (error) {
     console.error('Network error:', error.message);
   }
   ```

2. **API Errors** - Szerver hibát ad vissza (4xx, 5xx)
   ```javascript
   // ApiService.js automatikusan dob hibát
   // Frontend megjeeleníti az UI-ban (PopupCard)
   ```

3. **Validation Errors** - Kitöltés/validáció hiba
   ```javascript
   // Input validation a komponensekben
   // PopupCard-ban hibaüzenet
   ```

## State Management

Minden oldal/komponens saját local state-et használ (`useState`):

- `isLoading` - Betöltés közben mutat spinner/üzenetet
- `error` - Hibákat tárol és mutatja az UI-ban
- `data` - Az API-ból lekért adatokat tároli

Nincs globális state management (Redux, Zustand) - local state elegendő.

## Testing the Integration

### cURL tesztek

```bash
# 1. Regisztráció
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password"}'

# 2. Bejelentkezés (token megkapása)
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}')
TOKEN=$(echo $RESPONSE | jq -r '.token')

# 3. Projektek lekérése
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

### Frontend tesztek (UI-ban)

1. Nyitni az alkalmazást: http://localhost:5173
2. Bejelentkezni a regisztrált adatokkal
3. Számára az alábbi funkciókat:
   - Projektek megtekintése
   - Issue-k létrehozása
   - Issue részleteinek megtekintése
   - Hozzászólások hozzáadása

## Integration Checklist

- [x] ApiService.js - HTTP client
- [x] AuthService.js - Hitelesítés
- [x] ProjectService.js - Projektek
- [x] IssueService.js - Issue-k
- [x] CommentService.js - Hozzászólások
- [x] LabelService.js - Címkék
- [x] LoginPage.jsx - API integráció
- [x] DashboardPage.jsx - API integráció
- [x] ProjectsPage.jsx - API integráció
- [x] ProjectDetailsPage.jsx - API integráció
- [x] IssueDetailsPage.jsx - API integráció
- [x] CreateIssuePage.jsx - API integráció
- [x] Navbar.jsx - Auth state + logout
- [x] AppRouter.jsx - Login redirect
- [x] .env file - API URL
- [x] Environment variable support (Vite)

## Deployment

### Frontend Deployment (Vercel, Netlify, etc.)

```bash
# Build
npm run build

# Output: dist/ folder
```

Environment variables:
```
VITE_API_URL=https://your-api-domain.com/api
```

### Backend Deployment (Heroku, Railway, DigitalOcean, etc.)

```bash
# Environment variables
PORT=3000
NODE_ENV=production
```

## Troubleshooting

### "Cannot find token" error
- Ellenőrizd, hogy localStorage-ben van-e a token
- Logout és login-el újra
- Browser console-ban: `localStorage.getItem('token')`

### CORS error
- Backend CORS middleware már bekapcsolt ✓
- Frontend `.env`-ben az API URL pont
- Check backend PORT megfelelő-e

### API responses 401 Unauthorized
- Token lejárt vagy érvénytelen
- Logout: `AuthService.logout()`
- Login újra: bejelentkezés szükséges

### Issues nem jelennek meg
- Ellenőrizd, hogy projekt létezik-e
- Network tab-ban biztonságosan érkezik-e az API response

## Future Enhancements

- [ ] JWT token (valódi hitelesítés)
- [ ] Token refresh mechanism
- [ ] Global state management (Redux/Zustand)
- [ ] Real-time updates (WebSocket)
- [ ] File upload/attachment handling
- [ ] Role-based access control
- [ ] Search/filter UI improvements
- [ ] Dark mode support

---

**Status:** ✅ Complete Frontend-Backend Integration  
**Last Updated:** 2026-04-02  
**Testing:** Ready for manual QA
