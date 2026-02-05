# Development Best Practices

## Code Organization

### Frontend (Vue.js)

#### Component Structure
```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'

// 2. Types
interface MyType {
  id: string
}

// 3. Props and Emits
defineProps<{ task: MyType }>()
const emit = defineEmits<{ update: [id: string] }>()

// 4. State
const state = ref(false)

// 5. Computed
const computed = computed(() => state.value)

// 6. Lifecycle
onMounted(() => {})

// 7. Methods
const handleClick = () => {}
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Component-scoped styles */
</style>
```

#### Service Usage
- Use services in `onMounted` lifecycle or event handlers
- Never fetch in template
- Use reactive refs for data
- Handle loading and error states

### Backend (Node.js + Express)

#### Route Structure
```typescript
router.get('/', (req, res) => {
  // 1. Validate input
  // 2. Call service
  // 3. Return response
})
```

#### Service Pattern
```typescript
export class MyService {
  static async operation() {
    // Business logic here
  }
}
```

#### Error Handling
```typescript
try {
  const result = await service.operation()
  res.json(result)
} catch (error) {
  console.error('Error:', error)
  res.status(500).json({ error: 'Message' })
}
```

## Naming Conventions

### Frontend
- Components: `PascalCase` (e.g., `TaskBoard.vue`)
- Props: `camelCase` (e.g., `taskList`)
- Events: `kebab-case` (e.g., `@task-created`)
- Methods: `camelCase` (e.g., `handleSubmit`)
- Services: `camelCase` with `Service` suffix (e.g., `taskService`)

### Backend
- Routes: `kebab-case` endpoints (e.g., `/api/tasks`)
- Methods: `camelCase` (e.g., `getAllTasks`)
- Classes: `PascalCase` (e.g., `TaskService`)
- Constants: `UPPER_CASE` (e.g., `MAX_TITLE_LENGTH`)

## TypeScript Best Practices

### Frontend
```typescript
// Good: Define interfaces
interface Task {
  _id: string
  title: string
  completed: boolean
}

// Good: Type function parameters
function updateTask(task: Task): void {}

// Good: Type ref values
const tasks = ref<Task[]>([])

// Avoid: Using 'any'
const data: any = {}  // ❌ Avoid
```

### Backend
```typescript
// Good: Type function parameters and returns
async function createTask(title: string): Promise<ITask> {
  // Implementation
}

// Good: Define request/response types
interface CreateTaskRequest {
  title: string
}

// Good: Use enums for constants
enum TaskStatus {
  Active = 'active',
  Completed = 'completed',
}
```

## Error Handling

### Frontend
```typescript
try {
  const task = await taskApi.createTask({ title })
  tasks.value.push(task)
} catch (error) {
  console.error('Failed to create task:', error)
  error.value = 'Failed to create task'
}
```

### Backend
```typescript
try {
  const task = await TaskService.createTask(title)
  res.status(201).json({ task })
} catch (error: any) {
  if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message })
  } else {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

## Testing Strategy

### Frontend Testing (Future)
```bash
# Unit tests for services
npm run test:unit

# E2E tests with Cypress
npm run test:e2e

# Component testing
npm run test:component
```

### Backend Testing (Future)
```bash
# Unit tests with Jest
npm run test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

## Git Workflow

### Commit Messages
```
Format: <type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Refactoring
- test: Tests
- chore: Maintenance

Examples:
feat(tasks): add task completion toggle
fix(api): handle missing task ID
docs(setup): add deployment instructions
```

### Branch Naming
```
feature/task-filtering
fix/websocket-connection
docs/api-documentation
```

## Performance Tips

### Frontend
- Use `computed` for derived state
- Avoid unnecessary re-renders with `ref` over reactive objects
- Lazy load components: `defineAsyncComponent`
- Optimize images and assets
- Use `v-show` for frequently toggled elements

### Backend
- Use database indexes for common queries
- Implement caching strategies
- Use async/await properly
- Implement request throttling
- Monitor and log slow queries

### Database
- Create indexes on frequently queried fields
- Use `lean()` queries when you don't need document methods
- Batch operations when possible
- Monitor connection pool

## Logging Best Practices

### Frontend
```typescript
// Use console with clear context
console.log('[TaskBoard] Tasks loaded:', tasks.length)
console.error('[TaskBoard] Failed to load:', error)

// Avoid in production
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}
```

### Backend
```typescript
// Use structured logging
console.log(`[TaskRoute] Creating task: "${title}"`)
console.error('Error creating task:', error)
console.warn('MongoDB connection slow')

// Log meaningful context
console.log(`[${new Date().toISOString()}] ${method} ${path}`)
```

## Code Review Checklist

### Frontend
- [ ] TypeScript types defined
- [ ] No console errors in browser
- [ ] Props and emits properly typed
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Responsive design tested
- [ ] Accessibility checked (alt text, ARIA labels)
- [ ] No hardcoded strings

### Backend
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] Database queries efficient
- [ ] TypeScript types correct
- [ ] API documentation updated
- [ ] No sensitive data in logs
- [ ] Tests added/updated
- [ ] No console.log left in production code

## Common Pitfalls to Avoid

### Frontend
- ❌ Fetching in `useEffect`/`onMounted` without cleanup
- ❌ Not handling loading/error states
- ❌ Mutating props directly
- ❌ Using `v-if` with expensive computations
- ❌ Forgetting to unsubscribe from WebSocket events

### Backend
- ❌ Not validating user input
- ❌ Catching errors without handling them
- ❌ Not using try-catch with async operations
- ❌ Hardcoding configuration values
- ❌ Not closing database connections properly

## Documentation

### In-Code Comments
```typescript
// Good: Explain WHY, not WHAT
// Validate before saving to optimize database calls
if (!title.trim()) return

// Avoid: Obvious comments
// Set state to true
setState(true)
```

### Function Documentation
```typescript
/**
 * Create a new task
 * @param title - Task title (required, max 255 chars)
 * @returns Promise<Task> - The created task
 * @throws ValidationError if title is empty
 */
async function createTask(title: string): Promise<Task> {
  // Implementation
}
```

## Resources

- [Vue.js 3 Style Guide](https://vuejs.org/guide/scaling-up/sfc.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance)
- [RESTful API Design](https://restfulapi.net)
