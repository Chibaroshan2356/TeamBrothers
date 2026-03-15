# 🔑 How to Get Firebase Service Account Credentials

## Current Status

✅ Frontend is working perfectly  
✅ Google popup opens and you can select account  
❌ Backend can't verify tokens (needs real service account)  

## The Error You're Seeing

**"Google authentication is not configured on the server"**

This happens because `backend/config/firebase-service-account.json` has placeholder credentials, not real ones.

---

## 📥 Step-by-Step: Download Service Account

### Step 1: Go to Firebase Console

Open: https://console.firebase.google.com/

### Step 2: Select Your Project

Click on **"teambrothers"** project

### Step 3: Go to Project Settings

1. Click the **gear icon** ⚙️ in the top left
2. Click **"Project settings"**

### Step 4: Go to Service Accounts Tab

1. Click the **"Service accounts"** tab at the top
2. You'll see a section titled "Firebase Admin SDK"

### Step 5: Generate Private Key

1. Scroll down to find the button **"Generate new private key"**
2. Click it
3. A popup will appear warning you to keep it secure
4. Click **"Generate key"**
5. A JSON file will download automatically

### Step 6: Replace the File

1. The downloaded file will be named something like:
   `teambrothers-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

2. **Option A: Rename and move it**
   - Rename it to: `firebase-service-account.json`
   - Move it to: `backend/config/firebase-service-account.json`
   - Replace the existing placeholder file

3. **Option B: Copy the contents**
   - Open the downloaded JSON file
   - Copy ALL the contents
   - Open `backend/config/firebase-service-account.json`
   - Replace everything with the copied content
   - Save the file

### Step 7: Restart Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Firebase Admin SDK initialized successfully
Server running in development mode on port 5000
```

### Step 8: Test Google Login

1. Go to `http://localhost:8080/login`
2. Click **"Continue with Google"**
3. Select your Google account
4. **Success!** You should be redirected to the home page 🎉

---

## 🔍 What the Service Account File Looks Like

The real file will look like this (with actual values):

```json
{
  "type": "service_account",
  "project_id": "teambrothers",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@teambrothers.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40teambrothers.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

---

## 🚨 Security Warning

**NEVER commit this file to git!**

The `.gitignore` file already excludes it, but double-check:
- ❌ Don't share it publicly
- ❌ Don't commit it to GitHub
- ❌ Don't post it in chat/forums
- ✅ Keep it secure on your server only

---

## 🎯 Quick Checklist

- [ ] Go to Firebase Console
- [ ] Select "teambrothers" project
- [ ] Go to Project Settings → Service Accounts
- [ ] Click "Generate new private key"
- [ ] Download the JSON file
- [ ] Save it as `backend/config/firebase-service-account.json`
- [ ] Restart backend server
- [ ] Test Google login

---

## 🆘 Troubleshooting

### "I don't have access to Firebase Console"

You need to be an owner or editor of the "teambrothers" Firebase project. Contact the project owner to:
1. Add you as a project member
2. Or have them generate and send you the service account JSON (securely!)

### "The file downloaded with a different name"

That's normal! Just rename it to `firebase-service-account.json` and place it in `backend/config/`

### "Backend still shows error after adding file"

1. Make sure the file is in the correct location: `backend/config/firebase-service-account.json`
2. Make sure it's valid JSON (no syntax errors)
3. Restart the backend server
4. Check backend console for error messages

### "Backend says 'Firebase Admin SDK initialized successfully' but login still fails"

Check:
1. Is MongoDB running?
2. Is `JWT_SECRET` set in `backend/.env`?
3. Check backend console for specific error messages
4. Check browser console for frontend errors

---

## ✅ After Setup

Once you have the real service account file:

1. ✅ Frontend Google popup works
2. ✅ Backend verifies the token
3. ✅ User is created in MongoDB
4. ✅ JWT token is generated
5. ✅ User is redirected to home page
6. ✅ User stays logged in

**You'll have a fully working Google authentication system!** 🎉

---

## 📚 Related Documentation

- `QUICK_START_GOOGLE_AUTH.md` - Complete setup guide
- `TROUBLESHOOTING.md` - Common issues and solutions
- `GOOGLE_AUTH_IMPLEMENTATION.md` - Technical details

---

**Current file location**: `backend/config/firebase-service-account.json`  
**Status**: Contains placeholder values - needs real credentials from Firebase Console
