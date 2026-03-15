# 🔧 Troubleshooting Guide - Google Authentication

## Common Errors and Solutions

### 1. "Google Login (Not Configured)" Button

**Symptom**: Button shows "Google Login (Not Configured)" and is disabled

**Cause**: Firebase environment variables are not set in the frontend

**Solution**:
```bash
# Create .env file in root directory
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important**: Restart the dev server after adding environment variables!
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

---

### 2. Backend Error: "Cannot find module './firebase-service-account.json'"

**Symptom**: Backend crashes on startup with module not found error

**Cause**: Firebase service account JSON file is missing

**Solution**:
1. Download service account JSON from Firebase Console
2. Place it in `backend/config/firebase-service-account.json`
3. Restart backend server

**Alternative**: The backend now handles this gracefully and will show:
```
⚠️  Firebase service account file not found
Google OAuth will not be available
```

---

### 3. "Google authentication is not configured on the server"

**Symptom**: Frontend shows this error when clicking Google login button

**Cause**: Backend Firebase Admin SDK is not initialized

**Solution**:
1. Ensure `backend/config/firebase-service-account.json` exists
2. Check backend console for Firebase initialization messages
3. Restart backend server

**Check Backend Logs**:
```bash
cd backend
npm start

# Should see:
✅ Firebase Admin SDK initialized successfully
```

---

### 4. "Invalid ID token" Error

**Symptom**: Google popup works but login fails with invalid token error

**Possible Causes & Solutions**:

**A. Project ID Mismatch**
- Frontend and backend must use the same Firebase project
- Check `VITE_FIREBASE_PROJECT_ID` matches `project_id` in service account JSON

**B. Service Account Permissions**
- Ensure service account has "Firebase Authentication Admin" role
- Regenerate service account key if needed

**C. Clock Skew**
- Ensure server time is synchronized
- Check system time on both client and server

---

### 5. CORS Error

**Symptom**: Network error or CORS policy violation

**Solution**:
1. Add your domain to Firebase authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add `localhost` for development
   - Add your production domain

2. Check backend CORS configuration in `backend/server.js`:
```javascript
app.use(cors()); // Should allow all origins in development
```

---

### 6. "Popup closed by user" Error

**Symptom**: Error appears when closing Google popup

**Cause**: User closed the popup before completing authentication

**Solution**: This is expected behavior. User can try again.

---

### 7. MongoDB Connection Error

**Symptom**: Backend fails to start with MongoDB connection error

**Solution**:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Or use MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Check backend/.env**:
```env
MONGODB_URI=mongodb://localhost:27017/road-trip-advisor
```

---

### 8. JWT_SECRET Missing Error

**Symptom**: "JWT_SECRET is not defined" error

**Solution**:
Create `backend/.env` file:
```env
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
MONGODB_URI=mongodb://localhost:27017/road-trip-advisor
```

---

### 9. "Password is required" Error for Google Users

**Symptom**: Google users can't be created in database

**Cause**: User model requires password

**Solution**: Already fixed! The User model now makes password optional for Google OAuth users.

**Verify the fix**:
```javascript
// backend/models/User.js
password: {
  type: String,
  required: function() {
    return !this.googleId; // Password not required for Google users
  },
  minlength: 6,
  select: false,
}
```

---

### 10. Environment Variables Not Loading

**Symptom**: Environment variables are undefined

**Solutions**:

**Frontend (Vite)**:
- Variables must start with `VITE_`
- Restart dev server after changing `.env`
- Check file is named exactly `.env` (not `.env.txt`)

**Backend (Node.js)**:
- Ensure `dotenv` is installed: `npm install dotenv`
- Check `require('dotenv').config()` is at top of `server.js`
- File must be named `backend/.env`

---

### 11. "Network request failed" Error

**Symptom**: Cannot connect to backend API

**Possible Causes & Solutions**:

**A. Backend Not Running**
```bash
cd backend
npm start
# Should see: Server running on port 5000
```

**B. Wrong API URL**
- Check frontend is using correct backend URL
- Default: `http://localhost:5000`

**C. Firewall Blocking**
- Check firewall settings
- Ensure port 5000 is not blocked

---

### 12. Google Popup Blocked

**Symptom**: Google popup doesn't open

**Solution**:
- Check browser popup blocker settings
- Allow popups for `localhost` or your domain
- Try different browser

---

## Debugging Steps

### Step 1: Check Frontend Configuration

```bash
# Check .env file exists
ls -la .env

# Check environment variables are loaded
# In browser console:
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
```

### Step 2: Check Backend Configuration

```bash
# Check service account file exists
ls -la backend/config/firebase-service-account.json

# Check backend .env
cat backend/.env

# Start backend and check logs
cd backend
npm start
```

### Step 3: Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Check Authentication → Sign-in method → Google is enabled
4. Check Settings → Authorized domains includes your domain

### Step 4: Test API Endpoint

```bash
# Test backend is running
curl http://localhost:5000/api/auth/me

# Should return 401 (unauthorized) - this is correct!
```

### Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Network tab for failed requests

### Step 6: Check MongoDB

```bash
# Connect to MongoDB
mongosh

# Check database
use road-trip-advisor
db.users.find().pretty()
```

---

## Quick Fixes

### Reset Everything

```bash
# Stop all servers
# Ctrl+C in all terminals

# Clear node_modules
rm -rf node_modules backend/node_modules

# Reinstall dependencies
npm install
cd backend && npm install && cd ..

# Clear browser cache and localStorage
# In browser console:
localStorage.clear()

# Restart servers
cd backend && npm start &
npm run dev
```

### Test Without Google Login

If Google login isn't working, you can still use email/password:

```bash
# Create a test user via signup page
# Or use admin credentials:
Email: admin23@gmail.com
Password: admin123
```

---

## Getting Help

### Check Logs

**Backend Logs**:
```bash
cd backend
npm start
# Watch for errors in console
```

**Frontend Logs**:
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab

### Verify Configuration

**Frontend**:
```javascript
// In browser console
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Don't log full config in production!
})
```

**Backend**:
```javascript
// Add to backend/server.js temporarily
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
```

### Test Components Individually

1. **Test MongoDB**: Can you connect?
2. **Test Backend**: Does it start without errors?
3. **Test Frontend**: Does it load without errors?
4. **Test Firebase**: Can you see the config in browser console?
5. **Test Email Login**: Does traditional login work?
6. **Test Google Login**: Now try Google authentication

---

## Still Having Issues?

### Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend dev server is running on port 5173
- [ ] `.env` file exists in root directory
- [ ] `backend/.env` file exists
- [ ] `backend/config/firebase-service-account.json` exists
- [ ] All environment variables are set correctly
- [ ] Dev servers restarted after changing `.env` files
- [ ] Firebase project created
- [ ] Google Authentication enabled in Firebase
- [ ] Authorized domains configured in Firebase
- [ ] No errors in browser console
- [ ] No errors in backend console

### Documentation

- `QUICK_START_GOOGLE_AUTH.md` - Setup guide
- `GOOGLE_OAUTH_SETUP.md` - Detailed Firebase setup
- `GOOGLE_AUTH_IMPLEMENTATION.md` - Technical details
- `DEPLOYMENT_CHECKLIST.md` - Production deployment

---

**Last Updated**: After fixing Firebase initialization error handling
