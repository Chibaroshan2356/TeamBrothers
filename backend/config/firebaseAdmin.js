const admin = require("firebase-admin");

let firebaseInitialized = false;

try {
  // Debug: Check if environment variables are loaded
  console.log("🔍 Checking Firebase environment variables:");
  console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID ? "✅ Found" : "❌ Missing");
  console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL ? "✅ Found" : "❌ Missing");
  console.log("FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "✅ Found" : "❌ Missing");

  // Use environment variables instead of file
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  };

  // Check if all required environment variables are present
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.warn("⚠️ Firebase environment variables not found - Firebase features disabled");
    console.log("Required env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
    firebaseInitialized = false;
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log("✅ Firebase Admin initialized successfully");
  }

} catch (error) {
  console.error("❌ Firebase init error:", error);
  firebaseInitialized = false;
}

module.exports = admin;
module.exports.firebaseInitialized = firebaseInitialized;
