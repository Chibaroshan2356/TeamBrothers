# 🔐 Google OAuth Setup Guide

## 📋 **Prerequisites**

### **1. Firebase Project Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** service
4. Enable **Google** as a sign-in provider
5. Add your app domain to authorized domains

### **2. Service Account Setup**
1. In Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to `firebase-service-account.json`
5. Place it in `backend/config/` folder

## 🔧 **Configuration Steps**

### **Frontend (.env)**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **Backend (.env)**
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### **Service Account JSON**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-client-email@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-client-id%40your-project-id.iam.gserviceaccount.com"
}
```

## 🚀 **Implementation Features**

### **✅ Frontend Features**
- **🔗 Firebase Integration**: Firebase Authentication SDK
- **🎨 Google Button**: Styled with Tailwind and shadcn/ui
- **🔄 Loading States**: Visual feedback during authentication
- **📱 Mobile Responsive**: Works on all devices
- **🔒 Secure Token Handling**: Proper ID token management

### **✅ Backend Features**
- **🔐 Token Verification**: Firebase Admin SDK verification
- **👤 User Management**: Auto-create users in MongoDB
- **🎫 JWT Generation**: Secure session tokens
- **🛡️ Error Handling**: Comprehensive error responses
- **📊 User Data**: Store Google profile information

### **✅ Security Features**
- **🔑 ID Token Verification**: Firebase validates Google tokens
- **🛡️ JWT Security**: Secure session management
- **🔒 HTTPS Required**: Production security
- **📝 Audit Logs**: Authentication event tracking

## 🎯 **Usage Flow**

### **1. User Clicks Google Button**
```typescript
// Frontend: Firebase popup authentication
const result = await signInWithPopup(auth, googleProvider);
const idToken = await result.user.getIdToken();
```

### **2. Token Sent to Backend**
```javascript
// Backend: Verify Firebase token
const decodedToken = await admin.auth().verifyIdToken(idToken);
```

### **3. User Created/Updated**
```javascript
// Backend: Store user in MongoDB
let user = await User.findOne({ email });
if (!user) {
  user = new User({ name, email, role: 'user' });
  await user.save();
}
```

### **4. JWT Token Generated**
```javascript
// Backend: Create session token
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### **5. User Logged In**
```typescript
// Frontend: Store session
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

## 🔍 **Testing Steps**

### **1. Setup Firebase**
- ✅ Create Firebase project
- ✅ Enable Google Authentication
- ✅ Generate service account key
- ✅ Configure environment variables

### **2. Test Frontend**
- ✅ Navigate to `/login`
- ✅ Click "Continue with Google"
- ✅ Complete Google sign-in
- ✅ Verify redirect to `/home`

### **3. Test Backend**
- ✅ Check token verification
- ✅ Verify user creation in MongoDB
- ✅ Test JWT token generation
- ✅ Validate API responses

### **4. Test Integration**
- ✅ Complete authentication flow
- ✅ Test session persistence
- ✅ Verify user data storage
- ✅ Check error handling

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Firebase Configuration Error**
```bash
Error: Firebase configuration missing
```
**Solution**: Check `.env` file for Firebase credentials

#### **Service Account Error**
```bash
Error: Invalid service account credentials
```
**Solution**: Verify `firebase-service-account.json` file

#### **Token Verification Error**
```bash
Error: Invalid ID token
```
**Solution**: Check Firebase project settings and domain configuration

#### **CORS Error**
```bash
Error: CORS policy violation
```
**Solution**: Add frontend domain to Firebase authorized domains

### **Debug Tips**

1. **Check Console Logs**: Look for Firebase initialization errors
2. **Verify Network Tab**: Check API requests and responses
3. **Test Token**: Use Firebase token debugger
4. **Check MongoDB**: Verify user creation in database

## 📱 **UI Components**

### **Google Login Button**
```typescript
<Button 
  type="button" 
  variant="outline" 
  className="w-full"
  onClick={handleGoogleLogin}
  disabled={isGoogleLoading}
>
  <Chrome className="mr-2 h-4 w-4" />
  {isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}
</Button>
```

### **Loading States**
- **Button Loading**: Shows "Signing in with Google..."
- **Error Handling**: Displays toast notifications
- **Success Feedback**: Redirects to home page

## 🎨 **Design Integration**

### **Consistent Styling**
- **Tailwind CSS**: Matches existing design system
- **shadcn/ui**: Uses Button component
- **Lucide Icons**: Chrome icon for Google
- **Responsive Design**: Works on all screen sizes

### **User Experience**
- **Seamless Flow**: One-click authentication
- **Visual Feedback**: Loading states and error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Progressive Enhancement**: Works without JavaScript

---

## 🏆 **Success Criteria**

### **✅ Implementation Complete**
- [ ] Firebase project configured
- [ ] Google OAuth button added
- [ ] Backend API endpoint working
- [ ] User authentication flow complete
- [ ] JWT session management
- [ ] Error handling implemented

### **✅ Testing Complete**
- [ ] Frontend authentication works
- [ ] Backend token verification works
- [ ] User creation in MongoDB works
- [ ] Session persistence works
- [ ] Error scenarios handled

### **✅ Security Complete**
- [ ] Firebase tokens verified
- [ ] JWT tokens secure
- [ ] Environment variables protected
- [ ] HTTPS enforced in production
- [ ] Audit logging implemented

---

*This guide provides complete setup instructions for Google OAuth integration in your Road Trip Advisor application.*
