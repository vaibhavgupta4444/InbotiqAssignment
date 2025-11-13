# IBQUOI - Full Stack Authentication & CRUD Application

A comprehensive Next.js application featuring authentication, role-based access control, and CRUD operations with MongoDB.

## Features Implemented

### 1. Authentication System
- ✅ **Sign Up** with form validation (name, email, password, role selection)
- ✅ **Sign In** with credential verification
- ✅ **Role-based accounts**: User (0) and Admin (1)
- ✅ **Password hashing** using bcrypt
- ✅ **Form validation** using Zod

### 2. Protected Routes & Middleware
- ✅ **Middleware protection** for dashboard and items pages
- ✅ **Auto-redirect** to sign-in for unauthenticated users
- ✅ **Cookie-based session** management

### 3. Dashboard
- ✅ **Personalized welcome header**: "Welcome, [Name] (User/Admin)"
- ✅ **Different UI for Admin vs User**
  - Admin: "Manage All Items", "View Reports", "System Settings"
  - User: "My Items", "Update Settings", "Help & Support"
- ✅ **Account information card**
- ✅ **Logout functionality**

### 4. CRUD Operations
- ✅ **Create** new items
- ✅ **Read** items with filtering and search
- ✅ **Update** existing items
- ✅ **Delete** items
- ✅ **User-specific items** (users see only their items)
- ✅ **Admin can view all items** from all users

### 5. Data Table Features
- ✅ **Search functionality** (searches title and description)
- ✅ **Status filtering** (Active, Inactive, Completed)
- ✅ **Pagination** (10 items per page)
- ✅ **Responsive table** with edit/delete actions
- ✅ **Badge indicators** for item status

### 6. Form Validation
- ✅ **Zod schemas** for all forms
- ✅ **Client-side validation**
- ✅ **Server-side validation**
- ✅ **Validation error messages**

### 7. UI/UX Enhancements
- ✅ **shadcn/ui components** (button, input, card, table, dialog, badge, select)
- ✅ **Responsive design**
- ✅ **Loading states**
- ✅ **Error handling**
- ✅ **Success messages**

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Validation**: Zod
- **Authentication**: Custom (bcrypt)
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx          # Sign-in page with form
│   │   └── sign-up/
│   │       └── page.tsx           # Sign-up page with role selection
│   ├── api/
│   │   ├── auth/
│   │   │   ├── sign-in/
│   │   │   │   └── route.ts      # Sign-in API endpoint
│   │   │   ├── sign-up/
│   │   │   │   └── route.ts      # Sign-up API endpoint
│   │   │   └── [...nextauth]/
│   │   │       ├── options.ts     # NextAuth configuration
│   │   │       └── route.ts       # NextAuth handler
│   │   └── items/
│   │       ├── route.ts           # GET all items, POST create item
│   │       └── [id]/
│   │           └── route.ts       # GET, PUT, DELETE single item
│   ├── dashboard/
│   │   └── page.tsx               # Protected dashboard page
│   ├── items/
│   │   └── page.tsx               # Items management with data table
│   └── globals.css
├── components/
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       ├── badge.tsx
│       ├── select.tsx
│       └── ...
├── lib/
│   ├── dbConnect.ts               # MongoDB connection with caching
│   ├── validations.ts             # Zod validation schemas
│   └── utils.ts                   # Utility functions
├── models/
│   ├── User.ts                    # User Mongoose model
│   └── Item.ts                    # Item Mongoose model
├── middleware.ts                  # Route protection middleware
└── package.json
```

## Database Models

### User Model
```typescript
{
  name: string (required, 2-100 chars)
  email: string (required, unique, validated)
  password: string (required, hashed, min 6 chars)
  role: "0" | "1" (default: "0")
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Item Model
```typescript
{
  title: string (required, 3-100 chars)
  description: string (required, max 500 chars)
  status: "active" | "inactive" | "completed"
  userId: ObjectId (reference to User)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Sign in user

### Items CRUD
- `GET /api/items` - Get all items (with filters, search, pagination)
  - Query params: `userId`, `search`, `status`, `page`, `limit`
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get single item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000

## User Flow

### 1. Registration
1. Navigate to `/sign-up`
2. Fill in: Name, Email, Password, Confirm Password
3. Select role: User or Admin
4. Click "Sign Up"
5. Redirected to `/sign-in` with success message

### 2. Login
1. Navigate to `/sign-in` (or auto-redirected)
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/dashboard`

### 3. Dashboard
1. See personalized welcome message
2. View account information
3. Access quick actions based on role
4. Navigate to Items Management

### 4. Items Management
1. Click "Manage All Items" (Admin) or "My Items" (User)
2. **Search**: Type in search box to filter by title/description
3. **Filter**: Select status from dropdown
4. **Create**: Click "+ Add Item" button
5. **Edit**: Click pencil icon on any item
6. **Delete**: Click trash icon on any item
7. **Paginate**: Use Previous/Next buttons

### 5. Logout
Click "Logout" button to clear session and return to sign-in

## Key Differences: Admin vs User

| Feature | User (Role: 0) | Admin (Role: 1) |
|---------|---------------|-----------------|
| Dashboard Header | "Welcome, Name (User)" | "Welcome, Name (Admin)" |
| Items View | Only own items | All users' items |
| Table Columns | No owner column | Shows item owner |
| Quick Actions | My Items, Settings, Support | Manage All Items, Reports, Settings |

## Validation Rules

### Sign Up
- Name: 2-100 characters
- Email: Valid email format
- Password: Minimum 6 characters
- Confirm Password: Must match password

### Sign In
- Email: Valid email format
- Password: Required

### Items
- Title: 3-100 characters
- Description: 1-500 characters
- Status: Must be active, inactive, or completed

## Security Features
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Protected routes with middleware
- ✅ User-specific item access control
- ✅ Input validation on client and server
- ✅ MongoDB injection prevention
- ✅ Cookie-based session management

## Future Enhancements (Optional)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Profile picture upload
- [ ] Advanced search with multiple filters
- [ ] Export data to CSV/PDF
- [ ] Real-time updates with WebSockets
- [ ] Jest unit tests
- [ ] React Testing Library component tests
- [ ] E2E tests with Playwright

## Testing

### Manual Testing Checklist
- [x] Sign up with valid data
- [x] Sign up with invalid data (validation errors)
- [x] Sign in with correct credentials
- [x] Sign in with wrong credentials
- [x] Access protected routes without login (redirects)
- [x] Create item
- [x] Edit item
- [x] Delete item
- [x] Search items
- [x] Filter items by status
- [x] Pagination
- [x] Logout
- [x] Admin sees all items
- [x] User sees only own items

## License
MIT

## Author
Vaibhav Gupta
