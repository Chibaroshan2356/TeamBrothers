# 🚀 Quick Start: Google Authentication

## Prerequisites Checklist

- ✅ Node.js installed
- ✅ MongoDB running
- ✅ Firebase project created
- ✅ Google Authentication enabled in Firebase

## 5-Minute Setup

### Step 1: Firebase Console Setup (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Google** provider
5. Go to **Project Settings** → **Service Accounts**
6. Click **Generate new private key**
7. Save the JSON file as `firebase-service-account.json`

### Step 2: Configure Backend (1 minute)

1. Place `firebase-service-account.json` in `backend/config/` folder

2. Update `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/road-trip-advisor
JWT_SECRET=your_super_secret_jwt_key_here
```

### Step 3: Configure Frontend (1 minute)

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Copy the Firebase config values

4. Create/update `.env` in root folder:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Start the Application (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm install  # Only needed first time
npm start

# Terminal 2 - Frontend
npm install  # Only needed first time
npm run dev
```

### Step 5: Test Google Login

1. Open browser to `http://localhost:5173/login`
2. Click **"Continue with Google"** button
3. Select your Google account
4. You should be redirected to the home page!

## ✅ Verification

After successful login, check:

1. **Browser Console**: No errors
2. **LocalStorage**: Should contain `token` and `user`
3. **MongoDB**: New user document created
4. **Network Tab**: Successful POST to `/api/auth/google`

## 🐛 Troubleshooting

### "Firebase is not configured"
- Check `.env` file has all `VITE_FIREBASE_*` variables
- Restart the dev server after adding env variables

### "Invalid ID token"
- Verify `firebase-service-account.json` is in `backend/config/`
- Check that the service account matches your Firebase project

### "CORS Error"
- Add `http://localhost:5173` to Firebase authorized domains
- Go to Firebase Console → Authentication → Settings → Authorized domains

### Backend won't start
- Ensure MongoDB is running: `mongod`
- Check `backend/.env` has `MONGODB_URI` and `JWT_SECRET`

## 📁 File Structure

```
project/
├── .env                                    # Frontend env vars
├── backend/
│   ├── .env                               # Backend env vars
│   ├── config/
│   │   ├── firebase.js                    # Firebase Admin setup
│   │   └── firebase-service-account.json  # Service account key
│   ├── routes/
│   │   └── auth.js                        # Google OAuth endpoint
│   └── models/
│       └── User.js                        # User model with googleId
└── src/
    ├── config/
    │   └── firebase.ts                    # Firebase client config
    └── pages/
        └── Login.tsx                      # Login page with Google button
```

## 🎯 What Happens When User Logs In?

1. User clicks "Continue with Google"
2. Firebase popup opens → User selects account
3. Frontend gets Firebase ID token
4. Frontend sends token to `POST /api/auth/google`
5. Backend verifies token with Firebase Admin
6. Backend creates/finds user in MongoDB
7. Backend generates JWT token
8. Frontend stores JWT and user data
9. User redirected to home page

## 🔐 Security Notes

- Never commit `.env` files
- Never commit `firebase-service-account.json`
- Use strong `JWT_SECRET` in production
- Enable HTTPS in production
- Add only trusted domains to Firebase authorized domains

## 📚 Next Steps

- Read `GOOGLE_OAUTH_SETUP.md` for detailed documentation
- Read `GOOGLE_AUTH_IMPLEMENTATION.md` for technical details
- Customize user profile fields as needed
- Add more OAuth providers (Facebook, GitHub, etc.)

## 💡 Tips

- Use different Firebase projects for dev/staging/production
- Rotate service account keys periodically
- Monitor Firebase Authentication usage
- Set up Firebase security rules
- Enable Firebase Analytics for insights

---

**Need Help?** Check the detailed guides:
- `GOOGLE_OAUTH_SETUP.md` - Complete setup guide
- `GOOGLE_AUTH_IMPLEMENTATION.md` - Implementation details
