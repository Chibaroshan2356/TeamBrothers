const admin = require("firebase-admin");
const fs = require("fs");

let serviceAccount;

try {
  // Try production path first
  const prodPath = "/etc/secrets/firebase-service-account.json";
  
  if (fs.existsSync(prodPath)) {
    serviceAccount = require(prodPath);
    console.log("✅ Firebase Admin initialized (production)");
  } else {
    // Fallback to local development (comment out in production)
    // serviceAccount = require("./firebase-service-account.json");
    console.warn("⚠️ Firebase service account file not found - Firebase features disabled");
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
  }

} catch (error) {
  console.error("❌ Firebase init error:", error);
}

module.exports = admin;
