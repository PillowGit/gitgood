import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION_NAME = "users";

// GET: Retrieve sample_text using query parameters
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Fetch from Firestore
  const userRef = doc(db, COLLECTION_NAME, userId);
  const userSnap = await getDoc(userRef);

  // If user doesn't exist, make them a document with 'sample_text' as an empty string
  if (!userSnap.exists()) {
    await setDoc(userRef, { sample_text: "" });
    return NextResponse.json({ sample_text: "" });
  }

  const { sample_text } = userSnap.data();
  return NextResponse.json({ sample_text: sample_text || "" });
}

// POST: Update sample_text using query parameters
export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const body = await req.json();
  const { sample_text } = body;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (!sample_text) {
    return NextResponse.json(
      { error: "sample_text is required" },
      { status: 400 }
    );
  }

  // Update Firestore
  const userRef = doc(db, COLLECTION_NAME, userId);
  await setDoc(userRef, { sample_text }, { merge: true });

  return NextResponse.json({ message: "Sample text updated", sample_text });
}
