# FSP CRM - Django + React

A comprehensive Customer Relationship Management (CRM) system built with Django backend and React frontend.

## Features

- **User Authentication**: Manager and Employee roles with different permissions
- **Lead Management**: Track leads with status updates and follow-up scheduling
- **Property Management**: Upload and manage property listings with images
- **Flat Management**: Track available flats and assignments
- **Dashboard**: Real-time overview of leads, properties, and performance metrics
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui

## Tech Stack

### Backend (Django)
- Django 5.2.3
- Django REST Framework
- SQLite (development)
- Custom User Model
- CORS support for React

### Frontend (React)
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation
- React Query for data fetching

## Project Structure

```
FSP CRM/
├── backend/                 # Django backend
│   ├── api/                # Main Django app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   └── urls.py         # URL routing
│   ├── app/                # Django project settings
│   └── manage.py           # Django management
└── sales-success-navigator-main/  # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── contexts/       # React contexts
    │   ├── hooks/          # Custom hooks
    │   └── lib/            # Utilities and API
    └── package.json
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Set up initial data:**
   ```bash
   python manage.py setup_data
   ```

6. **Start Django development server:**
   ```bash
   python manage.py runserver
   ```

   The Django API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd sales-success-navigator-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start React development server:**
   ```bash
   npm run dev
   ```

   The React app will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login

### Leads
- `GET /api/leads/` - List leads
- `POST /api/leads/` - Create lead
- `GET /api/leads/{id}/` - Get lead details
- `PUT /api/leads/{id}/` - Update lead
- `DELETE /api/leads/{id}/` - Delete lead

### Properties
- `GET /api/properties/` - List properties
- `POST /api/properties/` - Create property
- `GET /api/properties/{id}/` - Get property details
- `PUT /api/properties/{id}/` - Update property
- `DELETE /api/properties/{id}/` - Delete property

### Flats
- `GET /api/flats/` - List flats
- `POST /api/flats/` - Create flat
- `GET /api/flats/{id}/` - Get flat details
- `PUT /api/flats/{id}/` - Update flat
- `DELETE /api/flats/{id}/` - Delete flat

### Test
- `GET /api/hello/` - Test endpoint

## Demo Credentials

### Manager Account
- Email: `manager@example.com`
- Password: `password`
- Permissions: Full access to all features

### Employee Account
- Email: `employee@example.com`
- Password: `password`
- Permissions: Access to assigned leads and flats

## Development

### Backend Development
- The Django backend uses SQLite for development
- API documentation is available at `/api/` when DEBUG=True
- Use Django admin at `/admin/` for database management

### Frontend Development
- The React app uses Vite for fast development
- Hot module replacement is enabled
- TypeScript provides type safety
- ESLint and Prettier are configured

## Testing the Connection

1. Start both servers (Django and React)
2. Navigate to the React app
3. Use the demo credentials to log in
4. The app will automatically connect to the Django API

## Production Deployment

### Backend
- Use PostgreSQL instead of SQLite
- Set DEBUG=False
- Configure proper CORS settings
- Use environment variables for sensitive data
- Set up proper authentication (JWT recommended)

### Frontend
- Build the app: `npm run build`
- Serve static files from a web server
- Configure environment variables for API URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 