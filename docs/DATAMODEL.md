# Adatmodell

## Entitások

### User
| Mező     | Típus   | Leírás           |
|----------|---------|------------------|
| id       | number  | egyedi azonosító |
| name     | string  | felhasználó neve |
| email    | string  | email cím        |
| password | string  | jelszó           |
| role     | boolean | admin vagy user  |

---

### Project
| Mező        | Típus  | Leírás             |
|-------------|--------|--------------------|
| id          | number | projekt azonosító  |
| name        | string | projekt neve       |
| description | string | projekt leírás     |
| createdAt   | date   | létrehozás dátuma  |
| ownerId     | number | projekt tulajdonos |

---

### Issue
| Mező        | Típus  | Leírás                    |
|-------------|--------|---------------------------|
| id          | number | issue azonosító           |
| title       | string | cím                       |
| description | string | leírás                    |
| status      | string | open / in progress / done |
| priority    | string | low / medium / high       |
| assigneeId  | number | felelős user              |
| projectId   | number | projekt                   |

---

### Comment
| Mező      | Típus  | Leírás                  |
|-----------|--------|-------------------------|
| id        | number | komment azonosító       |
| text      | string | komment szövege         |
| authorId  | number | komment író azonosítója |
| issueId   | number | issue                   |
| createdAt | date   | dátum                   |

---

### Label
| Mező  | Típus  | Leírás          |
|-------|--------|-----------------|
| id    | number | label azonosító |
| name  | string | címke neve      |
| color | string | címke színe     |

---

## Kapcsolatok

### Project

Project → Issue  
- 1:N kapcsolat  
- egy projekt több issue-t tartalmazhat

### Issue

Issue → Comment  
- 1:N kapcsolat  
- egy issue több kommentet tartalmazhat

Issue → Label  
- N:M kapcsolat  
- egy issue több labelt tartalmazhat
- egy label több issue-hoz tartozhat

### User

User → Project
- 1:N kapcsolat
- egy user több project-hez lehet hozzárendelve

User → Issue  
- N:M kapcsolat  
- egy user több issue-ért felelős lehet
- egy issue-hoz több user rendelhető

User → Comment  
- 1:N kapcsolat