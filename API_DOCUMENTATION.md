# API Documentation

## Base URL
- **Development**: `http://localhost:3001`
- **Production**: (Set by deployment)

## Authentication
Currently, the API does not require authentication. In production, add authentication headers.

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

## Endpoints

### Task Endpoints

#### GET /api/tasks
Retrieve all tasks

**Parameters**: None

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "completed": false,
      "createdAt": "2025-02-05T10:30:00.000Z",
      "updatedAt": "2025-02-05T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Errors**:
- 500: Server error

**Example**:
```bash
curl http://localhost:3001/api/tasks
```

---

#### GET /api/tasks/stats
Get task statistics

**Parameters**: None

**Response** (200 OK):
```json
{
  "total": 10,
  "completed": 3,
  "active": 7
}
```

**Errors**:
- 500: Server error

**Example**:
```bash
curl http://localhost:3001/api/tasks/stats
```

---

#### GET /api/tasks/:id
Retrieve a specific task

**Parameters**:
- `id` (string, required): Task ID

**Response** (200 OK):
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "completed": false,
    "createdAt": "2025-02-05T10:30:00.000Z",
    "updatedAt": "2025-02-05T10:30:00.000Z"
  }
}
```

**Errors**:
- 404: Task not found
- 500: Server error

**Example**:
```bash
curl http://localhost:3001/api/tasks/507f1f77bcf86cd799439011
```

---

#### POST /api/tasks
Create a new task

**Request Body**:
```json
{
  "title": "New task title"
}
```

**Validation Rules**:
- `title` (string, required)
  - Must not be empty
  - Maximum 255 characters
  - Automatically trimmed

**Response** (201 Created):
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New task title",
    "completed": false,
    "createdAt": "2025-02-05T10:31:00.000Z",
    "updatedAt": "2025-02-05T10:31:00.000Z"
  }
}
```

**Errors**:
- 400: Invalid input or validation error
- 500: Server error

**Example**:
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task"}'
```

---

#### PUT /api/tasks/:id
Update a task

**Parameters**:
- `id` (string, required): Task ID

**Request Body**:
```json
{
  "title": "Updated title",
  "completed": true
}
```

**Validation Rules**:
- At least one field is required
- `title` (string, optional): Max 255 characters
- `completed` (boolean, optional): true or false

**Response** (200 OK):
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "completed": true,
    "createdAt": "2025-02-05T10:30:00.000Z",
    "updatedAt": "2025-02-05T10:35:00.000Z"
  }
}
```

**Errors**:
- 400: Invalid input or validation error
- 404: Task not found
- 500: Server error

**Example**:
```bash
curl -X PUT http://localhost:3001/api/tasks/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

---

#### DELETE /api/tasks/:id
Delete a task

**Parameters**:
- `id` (string, required): Task ID

**Response** (200 OK):
```json
{
  "message": "Task deleted successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Deleted task",
    "completed": false,
    "createdAt": "2025-02-05T10:30:00.000Z",
    "updatedAt": "2025-02-05T10:30:00.000Z"
  }
}
```

**Errors**:
- 404: Task not found
- 500: Server error

**Example**:
```bash
curl -X DELETE http://localhost:3001/api/tasks/507f1f77bcf86cd799439011
```

---

#### PATCH /api/tasks/:id/toggle
Toggle task completion status

**Parameters**:
- `id` (string, required): Task ID

**Request Body**: None

**Response** (200 OK):
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Task title",
    "completed": true,
    "createdAt": "2025-02-05T10:30:00.000Z",
    "updatedAt": "2025-02-05T10:40:00.000Z"
  }
}
```

**Errors**:
- 404: Task not found
- 500: Server error

**Example**:
```bash
curl -X PATCH http://localhost:3001/api/tasks/507f1f77bcf86cd799439011/toggle
```

---

## WebSocket Events

### Connection

When a client connects to the WebSocket server, it immediately receives:

```javascript
socket.on('tasks:list', (data) => {
  console.log(data.tasks) // Array of all current tasks
})
```

### Client to Server Events

#### task:create
Create a new task via WebSocket

**Emit**:
```javascript
socket.emit('task:create', { title: 'New task' }, (response) => {
  console.log(response.success)
  console.log(response.task)
})
```

**Payload**:
```json
{
  "title": "New task"
}
```

**Callback Response**:
```json
{
  "success": true,
  "task": { ... }
}
```

---

#### task:update
Update a task via WebSocket

**Emit**:
```javascript
socket.emit('task:update', {
  id: 'task-id',
  title: 'Updated title',
  completed: true
}, (response) => {
  console.log(response.success)
})
```

**Payload**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Updated title",
  "completed": true
}
```

**Callback Response**:
```json
{
  "success": true,
  "task": { ... }
}
```

---

#### task:delete
Delete a task via WebSocket

**Emit**:
```javascript
socket.emit('task:delete', { id: 'task-id' }, (response) => {
  console.log(response.success)
})
```

**Payload**:
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

**Callback Response**:
```json
{
  "success": true
}
```

---

### Server to Client Events

#### tasks:list
Sent when client connects with all current tasks

**Listen**:
```javascript
socket.on('tasks:list', (data) => {
  console.log(data.tasks) // Array of tasks
})
```

**Payload**:
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Task",
      "completed": false,
      "createdAt": "2025-02-05T10:30:00.000Z",
      "updatedAt": "2025-02-05T10:30:00.000Z"
    }
  ]
}
```

---

#### task:created
Broadcast when a new task is created

**Listen**:
```javascript
socket.on('task:created', (data) => {
  console.log(data.task)
})
```

**Payload**:
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New task",
    "completed": false,
    "createdAt": "2025-02-05T10:31:00.000Z",
    "updatedAt": "2025-02-05T10:31:00.000Z"
  }
}
```

---

#### task:updated
Broadcast when a task is updated

**Listen**:
```javascript
socket.on('task:updated', (data) => {
  console.log(data.task)
})
```

**Payload**:
```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "completed": true,
    "createdAt": "2025-02-05T10:30:00.000Z",
    "updatedAt": "2025-02-05T10:35:00.000Z"
  }
}
```

---

#### task:deleted
Broadcast when a task is deleted

**Listen**:
```javascript
socket.on('task:deleted', (data) => {
  console.log(data.id)
})
```

**Payload**:
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Currently, no rate limiting is implemented. In production, add rate limiting to prevent abuse.

## CORS

CORS is enabled for the following origins (configurable):
- `http://localhost:5173` (development)
- `http://localhost:3000` (development alternative)

Update `CLIENT_URL` in `server/.env` to add more origins.

## Best Practices

### Handling Responses
```javascript
// Frontend example with Axios
try {
  const response = await axios.get('/api/tasks')
  console.log(response.data.tasks)
} catch (error) {
  console.error(error.response?.data?.error || error.message)
}
```

### WebSocket Error Handling
```javascript
socket.on('task:create', (data, callback) => {
  if (data.success) {
    console.log('Task created:', data.task)
  } else {
    console.error('Error:', data.error)
  }
})
```

### Request Validation
Always validate input on client and server side:
- Check required fields
- Validate data types
- Verify data length/format
- Sanitize string inputs

## Examples

### Create Task
**REST API**:
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

**WebSocket**:
```javascript
socket.emit('task:create', { title: 'Buy groceries' }, (res) => {
  if (res.success) {
    console.log('Task created:', res.task)
  }
})
```

### Update Task
**REST API**:
```bash
curl -X PUT http://localhost:3001/api/tasks/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**WebSocket**:
```javascript
socket.emit('task:update', {
  id: '507f1f77bcf86cd799439011',
  completed: true
}, (res) => {
  if (res.success) {
    console.log('Task updated:', res.task)
  }
})
```

---

**API Version**: 1.0.0  
**Last Updated**: 2025-02-05
