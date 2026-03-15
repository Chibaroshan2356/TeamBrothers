# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend
- Vite
- TypeScript
- React 18
- shadcn-ui
- Tailwind CSS
- Firebase Authentication (Google OAuth)

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Firebase Admin SDK

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Authentication Features

This project includes both traditional email/password authentication and Google OAuth login.

### Google Authentication Setup

To enable Google login, you need to configure Firebase:

1. **Quick Start**: See `QUICK_START_GOOGLE_AUTH.md` for a 5-minute setup guide
2. **Detailed Setup**: See `GOOGLE_OAUTH_SETUP.md` for comprehensive instructions
3. **Implementation Details**: See `GOOGLE_AUTH_IMPLEMENTATION.md` for technical documentation

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration (for Google OAuth)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create a `backend/.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/road-trip-advisor

# JWT
JWT_SECRET=your_jwt_secret_key

# Firebase (service account JSON should be in backend/config/)
```

### Running the Application

```bash
# Start Backend
cd backend
npm install
npm start

# Start Frontend (in a new terminal)
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Documentation

- `QUICK_START_GOOGLE_AUTH.md` - Quick setup guide for Google authentication
- `GOOGLE_OAUTH_SETUP.md` - Detailed Firebase and OAuth setup instructions
- `GOOGLE_AUTH_IMPLEMENTATION.md` - Technical implementation details
- `LOGIN_PAGE_LAYOUT.md` - UI/UX documentation for the login page
- `DEPLOYMENT_CHECKLIST.md` - Production deployment checklist
- `IMPLEMENTATION_SUMMARY.md` - Summary of all changes made
