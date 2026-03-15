const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
const serviceAccountExists = fs.existsSync(serviceAccountPath);

let firebaseInitialized = false;

if (serviceAccountExists) {
  try {
    const serviceAccount = require('./firebase-service-account.json');
    
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
    });
    
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    console.log('Google OAuth will not be available');
  }
} else {
  console.warn('⚠️  Firebase service account file not found at:', serviceAccountPath);
  console.log('Google OAuth will not be available. See QUICK_START_GOOGLE_AUTH.md for setup instructions.');
}

module.exports = admin;
module.exports.firebaseInitialized = firebaseInitialized;
