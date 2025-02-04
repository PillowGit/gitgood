// src/lib/fetchWithCache.js
import { doc, getDoc } from "firebase/firestore";
import cache from "./cache";
import { db } from "./firebase";

export async function getDataFromFirestore(collection, docId) {
  const cacheKey = `${collection}-${docId}`;

  if (cache.has(cacheKey)) {
    console.log("Cache hit:", cacheKey);
    return cache.get(cacheKey);
  }

  console.log("Fetching from Firestore:", cacheKey);
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  cache.set(cacheKey, data);
  return data;
}
