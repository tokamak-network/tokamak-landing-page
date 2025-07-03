import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// 환경 변수 검증
const FIREBASE_API_KEY = process.env.NEXT_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.NEXT_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.NEXT_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.NEXT_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.NEXT_FIREBASE_APP_ID;
const FIREBASE_DATABASE_URL = process.env.NEXT_FIREBASE_DATABASE_URL;

if (
  !FIREBASE_API_KEY ||
  !FIREBASE_AUTH_DOMAIN ||
  !FIREBASE_PROJECT_ID ||
  !FIREBASE_STORAGE_BUCKET ||
  !FIREBASE_MESSAGING_SENDER_ID ||
  !FIREBASE_APP_ID ||
  !FIREBASE_DATABASE_URL
) {
  throw new Error(
    "Firebase configuration is incomplete. Please check your environment variables."
  );
}

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  databaseURL: FIREBASE_DATABASE_URL,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
