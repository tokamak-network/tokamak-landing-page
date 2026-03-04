import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

let firebaseApp: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;

  const apiKey = process.env.NEXT_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_FIREBASE_APP_ID;
  const databaseURL = process.env.NEXT_FIREBASE_DATABASE_URL;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId ||
    !databaseURL
  ) {
    throw new Error(
      "Firebase configuration is incomplete. Please check your environment variables."
    );
  }

  const existing = getApps();
  firebaseApp =
    existing.length > 0
      ? existing[0]
      : initializeApp({
          apiKey,
          authDomain,
          projectId,
          storageBucket,
          messagingSenderId,
          appId,
          databaseURL,
        });

  return firebaseApp;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const app = getFirebaseApp();
    const database = getDatabase(app);

    const dbPath = `biweekly-report/email-list`;
    const dbRef = ref(database, dbPath);

    await push(dbRef, {
      email: email,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Newsletter subscription completed successfully!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while processing your subscription.",
      },
      { status: 500 }
    );
  }
}
