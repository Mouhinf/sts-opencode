if (typeof window !== "undefined") {
  throw new Error("firebase/admin.ts ne doit jamais être utilisé côté client !");
}

import { initializeApp, getApps, cert, getApps as getAppsFunc } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: ReturnType<typeof initializeApp> | undefined;
let adminInitialized = false;
let db: ReturnType<typeof getFirestore> | undefined;

function initAdmin() {
  const apps = getAppsFunc();
  
  if (apps.length > 0) {
    adminApp = apps[0];
    db = getFirestore(adminApp);
    adminInitialized = true;
    console.log("Firebase Admin: already initialized");
    return;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      const cleanKey = privateKey
        .replace(/\\n/g, "\n")
        .replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----")
        .trim();

      adminApp = initializeApp({
        credential: cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: cleanKey,
        }),
      });
      db = getFirestore(adminApp);
      adminInitialized = true;
      console.log("Firebase Admin: initialized successfully, project:", projectId);
    } catch (error) {
      console.error("Firebase Admin initialization failed:", error);
      adminInitialized = false;
    }
  } else {
    console.warn("Firebase Admin credentials missing:", {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    });
    adminInitialized = false;
  }
}

initAdmin();

export { db, adminInitialized };
export const adminAuth = adminInitialized && adminApp ? getAuth(adminApp) : null;
export default adminApp;