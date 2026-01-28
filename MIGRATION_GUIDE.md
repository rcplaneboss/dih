# GadgetStore Pro - Supabase Migration Guide

## Setup Instructions

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. Go to Settings > Database and copy your connection string
4. Replace `DATABASE_URL` in `.env` file

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run db:generate
npm run db:push
npm run dev
```

### 3. Database Migration
The Prisma schema includes all your current data models:
- Products (with inventory tracking)
- Sales (with receipt generation)
- Categories and Brands
- Expenses
- Settings

### 4. Data Migration (Optional)
To migrate existing localStorage data to Supabase:

1. Export your current data using the export function in the app
2. Create a migration script to import the JSON data via API endpoints
3. Or manually re-enter critical data

### 5. Frontend Updates
The frontend has been updated to use API calls instead of localStorage:
- All CRUD operations now go through the backend API
- Error handling for network requests
- Async/await pattern for data operations

### 6. Environment Variables
Create `backend/.env` file:
```
DATABASE_URL="postgresql://username:password@db.supabase.co:5432/postgres"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 7. Running the Application
1. Start the backend: `cd backend && npm run dev`
2. Open the frontend: Open `index.html` in your browser or serve it locally

## Key Changes Made

### Backend (New)
- Express.js server with REST API
- Prisma ORM for database operations
- PostgreSQL database via Supabase
- Rate limiting and CORS protection

### Frontend (Updated)
- New `utils/api.js` for HTTP requests
- Updated `app.js` with async operations
- Error handling for API failures
- Maintained all existing functionality

### Database Schema
- Products: Full inventory management
- Sales: Transaction tracking with receipts
- Categories/Brands: Dynamic management
- Expenses: Business expense tracking
- Settings: Store configuration

## Benefits of Migration
1. **Data Persistence**: No more data loss on browser clear
2. **Multi-device Access**: Access from any device
3. **Backup & Recovery**: Automatic database backups
4. **Scalability**: Can handle larger datasets
5. **Real-time Sync**: Multiple users can access simultaneously
6. **Analytics**: Better reporting capabilities

## Next Steps
1. Set up Supabase project
2. Configure environment variables
3. Run database migrations
4. Test all functionality
5. Deploy to production (optional)

## Troubleshooting
- Ensure backend is running on port 3001
- Check CORS settings if requests fail
- Verify database connection string
- Check browser console for API errors