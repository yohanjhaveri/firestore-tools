import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import credentials from "./credentials.json";

const app = initializeApp({
  credential: credential.cert({
    clientEmail: credentials.client_email,
    privateKey: credentials.private_key,
    projectId: credentials.project_id,
  }),
  databaseURL: "https://<YOUR_DATABASE_URL_HERE>.firebaseio.com", // TODO: replace with your database URL
});

export const firestore = getFirestore(app);
