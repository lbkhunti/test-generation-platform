# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

---

## 🔐 Authentication Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "teacher|student",
  "class": "8|9|10",  // Required for students
  "school": "School Name"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "teacher"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "school": "New School"
}
```

---

## ❓ Question Endpoints

### Create Question
```http
POST /questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "MCQ",           // MCQ, SHORT_ANSWER, FILL_IN_BLANK, TRUE_FALSE
  "text": "What is 2+2?",
  "subject": "Mathematics", // Mathematics, Science, Both
  "chapter": "Arithmetic",
  "difficulty": "Easy",     // Easy, Medium, Hard
  "marks": 1,
  "options": [
    { "id": 1, "text": "3" },
    { "id": 2, "text": "4" },
    { "id": 3, "text": "5" }
  ],
  "correctAnswer": 2,
  "explanation": "2+2 equals 4",
  "keywords": ["two", "plus", "four"]
}

Response: 201 Created
{
  "success": true,
  "question": { ... }
}
```

### Get All Questions
```http
GET /questions?subject=Mathematics&difficulty=Easy&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "questions": [ ... ],
  "pagination": {
    "total": 50,
    "pages": 5,
    "currentPage": 1
  }
}
```

### Get Single Question
```http
GET /questions/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "question": { ... }
}
```

### Update Question
```http
PUT /questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated question text",
  "difficulty": "Hard",
  ...
}
```

### Delete Question
```http
DELETE /questions/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Question deleted"
}
```

---

## 📝 Test Endpoints

### Create Test
```http
POST /tests
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mathematics Mid-Term",
  "subject": "Mathematics",
  "class": "8",
  "duration": 30,           // minutes
  "totalMarks": 20,
  "questions": [
    {
      "questionId": "...",
      "marks": 1
    }
  ],
  "shuffleQuestions": false,
  "negativeMarking": 0
}

Response: 201 Created
{
  "success": true,
  "test": { ... }
}
```

### Get All Tests
```http
GET /tests?class=8&subject=Mathematics&status=published&page=1
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "tests": [ ... ],
  "pagination": { ... }
}
```

### Get Single Test
```http
GET /tests/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "test": { ... }
}
```

### Update Test
```http
PUT /tests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Test Name",
  "duration": 45,
  ...
}
```

### Publish Test
```http
PUT /tests/:id/publish
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "test": {
    "status": "published",
    "publishedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Delete Test
```http
DELETE /tests/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Test deleted"
}
```

---

## ✍️ Response Endpoints

### Start Test
```http
POST /responses/start-test
Authorization: Bearer <token>
Content-Type: application/json

{
  "testId": "..."
}

Response: 201 Created
{
  "success": true,
  "response": { ... },
  "test": { ... },
  "duration": 30
}
```

### Submit Answer
```http
POST /responses/submit-answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "responseId": "...",
  "questionId": "...",
  "answer": "4"  // or true/false for boolean
}

Response: 200 OK
{
  "success": true,
  "response": { ... }
}
```

### End Test
```http
POST /responses/end-test
Authorization: Bearer <token>
Content-Type: application/json

{
  "responseId": "..."
}

Response: 200 OK
{
  "success": true,
  "response": {
    "totalScore": 15,
    "percentage": 75,
    "status": "submitted"
  }
}
```

### Get Result
```http
GET /responses/result/:responseId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "response": {
    "studentId": { "name": "...", "email": "..." },
    "testId": { ... },
    "answers": [ ... ],
    "totalScore": 15,
    "percentage": 75,
    "result": "pass"
  }
}
```

### Grade Answer
```http
PUT /responses/:responseId/grade
Authorization: Bearer <token>
Content-Type: application/json

{
  "answerId": "...",
  "marksObtained": 0.5,
  "feedback": "Good attempt but needs more detail"
}

Response: 200 OK
{
  "success": true,
  "response": { ... }
}
```

---

## 📊 Analytics Endpoints

### Get Test Analytics
```http
GET /analytics/test/:testId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "analytics": {
    "totalAttempts": 25,
    "averageScore": 16.5,
    "highestScore": 20,
    "lowestScore": 8,
    "passRate": 88.5,
    "submissions": 25,
    "pending": 0
  }
}
```

### Get Question Analytics
```http
GET /analytics/question/:questionId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "analytics": {
    "totalAnswered": 25,
    "correct": 22,
    "incorrect": 3,
    "accuracy": 88.0
  }
}
```

### Get Student Analytics
```http
GET /analytics/student/:studentId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "analytics": {
    "totalTests": 10,
    "completedTests": 9,
    "inProgress": 1,
    "averageScore": 16.5,
    "passCount": 8,
    "passRate": 88.9,
    "testHistory": [ ... ]
  }
}
```

---

## 👥 Class Endpoints

### Get All Classes
```http
GET /classes
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "classes": [ ... ]
}
```

### Create Class
```http
POST /classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "8",
  "description": "Class 8 Mathematics",
  "subjects": ["Mathematics", "Science"]
}

Response: 201 Created
{
  "success": true,
  "class": { ... }
}
```

### Update Class
```http
PUT /classes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "8A",
  "description": "Updated description"
}
```

### Add Student to Class
```http
POST /classes/:id/add-student
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "..."
}

Response: 200 OK
{
  "success": true,
  "class": { ... }
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "details": ["Additional info if applicable"]
}
```

### Common Error Codes

| Code | Message |
|------|---------|
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting. Recommended limits for production:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## Version

API v1.0
