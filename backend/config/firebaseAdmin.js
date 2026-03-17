const admin = require("firebase-admin");
const fs = require("fs");

let serviceAccount;

try {
  const path = "/etc/secrets/firebase-service-account.json";

  if (fs.existsSync(path)) {
    serviceAccount = require(path);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized");

  } else {
    console.warn("⚠️ Firebase service account file not found");
  }

} catch (error) {
  console.error("Firebase init error:", error);
}

module.exports = admin;
