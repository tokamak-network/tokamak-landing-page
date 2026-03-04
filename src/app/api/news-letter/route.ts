import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

function getFirebaseApp() {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

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

  return initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    databaseURL,
  });
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

    // Firebase에 이메일 저장 - push()로 자동 키 생성
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
