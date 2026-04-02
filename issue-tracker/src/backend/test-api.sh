#!/bin/bash

# Issue Tracker Backend - cURL Test Script
# Szerver: http://localhost:3000
# Elő: npm start vagy npm run dev

BASE_URL="http://localhost:3000/api"

# Szintek
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Issue Tracker Backend API Test ===${NC}\n"

# 1. Health Check
echo -e "${GREEN}1. Health Check${NC}"
curl -s "$BASE_URL/health" | jq .
echo ""

# 2. Register User
echo -e "${GREEN}2. Register User${NC}"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')
echo "$USER_RESPONSE" | jq .
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.user.id')
echo -e "User ID: ${GREEN}$USER_ID${NC}\n"

# 3. Login
echo -e "${GREEN}3. Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo -e "Token: ${GREEN}$TOKEN${NC}\n"

# 4. Get Current User
echo -e "${GREEN}4. Get Current User${NC}"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 5. Create Project
echo -e "${GREEN}5. Create Project${NC}"
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "This is a test project"
  }')
echo "$PROJECT_RESPONSE" | jq .
PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.project.id')
echo -e "Project ID: ${GREEN}$PROJECT_ID${NC}\n"

# 6. Get All Projects
echo -e "${GREEN}6. Get All Projects${NC}"
curl -s -X GET "$BASE_URL/projects" | jq .
echo ""

# 7. Create Issue
echo -e "${GREEN}7. Create Issue${NC}"
ISSUE_RESPONSE=$(curl -s -X POST "$BASE_URL/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"title\": \"Test Issue\",
    \"description\": \"This is a test issue\",
    \"priority\": \"high\"
  }")
echo "$ISSUE_RESPONSE" | jq .
ISSUE_ID=$(echo "$ISSUE_RESPONSE" | jq -r '.issue.id')
echo -e "Issue ID: ${GREEN}$ISSUE_ID${NC}\n"

# 8. Get Issues with Filters
echo -e "${GREEN}8. Get Issues (with filters)${NC}"
curl -s -X GET "$BASE_URL/issues?projectId=$PROJECT_ID&priority=high&sortBy=createdAt&sortOrder=desc" | jq .
echo ""

# 9. Create Label
echo -e "${GREEN}9. Create Label${NC}"
LABEL_RESPONSE=$(curl -s -X POST "$BASE_URL/labels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"name\": \"Bug\",
    \"color\": \"#FF0000\",
    \"description\": \"Bug label\"
  }")
echo "$LABEL_RESPONSE" | jq .
LABEL_ID=$(echo "$LABEL_RESPONSE" | jq -r '.label.id')
echo -e "Label ID: ${GREEN}$LABEL_ID${NC}\n"

# 10. Add Label to Issue
echo -e "${GREEN}10. Add Label to Issue${NC}"
curl -s -X PATCH "$BASE_URL/issues/$ISSUE_ID/labels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"labelId\": \"$LABEL_ID\",
    \"action\": \"add\"
  }" | jq .
echo ""

# 11. Assign Issue
echo -e "${GREEN}11. Assign Issue${NC}"
curl -s -X PATCH "$BASE_URL/issues/$ISSUE_ID/assign" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\"
  }" | jq .
echo ""

# 12. Create Comment
echo -e "${GREEN}12. Create Comment${NC}"
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/comments/issue/$ISSUE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test comment"
  }')
echo "$COMMENT_RESPONSE" | jq .
COMMENT_ID=$(echo "$COMMENT_RESPONSE" | jq -r '.comment.id')
echo -e "Comment ID: ${GREEN}$COMMENT_ID${NC}\n"

# 13. Get Comments
echo -e "${GREEN}13. Get Issue Comments${NC}"
curl -s -X GET "$BASE_URL/comments/issue/$ISSUE_ID" | jq .
echo ""

# 14. Update Issue
echo -e "${GREEN}14. Update Issue${NC}"
curl -s -X PATCH "$BASE_URL/issues/$ISSUE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "critical"
  }' | jq .
echo ""

# 15. Update Project
echo -e "${GREEN}15. Update Project${NC}"
curl -s -X PATCH "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated project description"
  }' | jq .
echo ""

echo -e "${GREEN}=== Test Completed ===${NC}"
