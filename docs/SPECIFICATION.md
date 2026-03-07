# Projekt specifikáció

## Projekt leírás

Az alkalmazás egy egyszerű issue és projekt követő rendszer, amely hasonló funkcionalitást biztosít mint az Atlassian JIRA.  
A felhasználók projekteket hozhatnak létre, feladatokat (issue-kat) kezelhetnek, valamint követhetik a feladatok állapotát.

Az alkalmazás célja egy könnyen használható felület biztosítása kisebb csapatok számára, ahol átláthatóan lehet kezelni a feladatokat és projekteket.

Célfelhasználók:
- fejlesztő csapatok
- kisebb projektcsapatok
- egyéni fejlesztők

---

## Funkcionális követelmények

### Felhasználó kezelés
- felhasználók regisztrációja/ bejelentkezése
- profil megtekintése

### Projekt kezelés
- projekt létrehozása
- projektek listázása
- projekt részleteinek megtekintése

### Issue kezelés
- új issue létrehozása
- issue szerkesztése
- issue státuszának módosítása
- issue hozzárendelése felhasználóhoz

### Kommentek
- komment hozzáadása issue-hoz
- kommentek listázása

### Dashboard
- felhasználóhoz tartozó feladatok megjelenítése
- projekt áttekintés

---

## Nem-funkcionális követelmények

### Technológia
Frontend:
- React
- React DOM
- CSS

### Teljesítmény
- gyors kliens oldali navigáció
- minimális oldal újratöltés

### UX követelmények
- responsive design (mobile, tablet, desktop)
- könnyen áttekinthető feladatlista

---

## Felhasználói szerepkörök

### Admin
- felhasználók kezelése
- projekt issue-i szerkeztése  

### Felhasználó
- projektek létrehozása
- issue-k létrehozása
- saját issue-k kezelése
- kommentelés

---

## Képernyő lista / sitemap

Fő oldalak:
- Dashboard
- Projects
- Project details
- Issue details
- Create Issue
- Login
- 404 Not Found

Navbar:
- Dashboard
- Projects
- Profile