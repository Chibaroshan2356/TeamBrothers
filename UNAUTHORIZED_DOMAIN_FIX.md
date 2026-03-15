# 🔧 Fix: Unauthorized Domain Error

## Current Error
**"Firebase: Error (auth/unauthorized-domain)"**

This means Firebase doesn't recognize your domain as authorized for authentication.

## ✅ What I Fixed

Changed `vite.config.ts` to use `localhost` instead of `::` (all interfaces).

## 🚀 Next Steps

### Step 1: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 2: Access via localhost

Instead of: `http://172.23.160.1:8080/login`  
Use: `http://localhost:8080/login`

### Step 3: Add localhost to Firebase (If Not Already Added)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **"teambrothers"** project
3. Navigate to: **Authentication** → **Settings** → **Authorized domains**
4. Check if `localhost` is in the list
5. If not, click **Add domain** and add `localhost`
6. Click **Save**

## Alternative: Keep Using IP Address

If you prefer to use `172.23.160.1`, you need to add it to Firebase:

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Click **Add domain**
3. Add: `172.23.160.1`
4. Click **Save**

**Note**: You'll need to add each IP/domain you use for development.

## Testing

After restarting and using `localhost`:

1. Go to `http://localhost:8080/login`
2. Click **"Continue with Google"**
3. Google popup should open
4. Select your account
5. Should work! (Backend might still fail - needs service account)

## Common Authorized Domains

For development, you typically need:
- ✅ `localhost` (local development)
- ✅ `127.0.0.1` (alternative localhost)

For production:
- ✅ Your production domain (e.g., `yourdomain.com`)
- ✅ Your staging domain (e.g., `staging.yourdomain.com`)

## Why This Happens

Firebase restricts authentication to specific domains for security:
- Prevents unauthorized sites from using your Firebase project
- Protects against phishing attacks
- Ensures only your apps can authenticate users

## Summary

✅ Changed server to use `localhost`  
⚠️ Need to restart dev server  
⚠️ Access via `http://localhost:8080/login`  
⚠️ Ensure `localhost` is authorized in Firebase  

**Next**: Restart server and test with localhost!
