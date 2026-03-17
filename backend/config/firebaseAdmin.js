const admin = require("firebase-admin");

try {
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
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
  }

} catch (error) {
  console.error("❌ Firebase init error:", error);
}

module.exports = admin;
