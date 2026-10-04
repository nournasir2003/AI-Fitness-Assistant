// src/lib/firebase/conversations.ts
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { UIMessage } from "ai";

export type Conversation = {
  id: string;
  userId: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// ينشئ محادثة جديدة فاضية، يرجع الـ id
export async function createConversation(userId: string, firstMessage: string) {
  const title = firstMessage.slice(0, 40) || "محادثة جديدة";

  const docRef = await addDoc(collection(db, "conversations"), {
    userId,
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// يحفظ كل رسائل المحادثة (نحفظ القائمة كاملة كل مرة، أبسط من رسالة برسالة)
export async function saveMessages(
  conversationId: string,
  messages: UIMessage[],
) {
  await setDoc(doc(db, "conversations", conversationId, "data", "messages"), {
    messages: JSON.stringify(messages),
    updatedAt: serverTimestamp(),
  });

  // حدّث وقت آخر تعديل بالمحادثة الأم (يفيد بالترتيب بالقائمة)
  await setDoc(
    doc(db, "conversations", conversationId),
    { updatedAt: serverTimestamp() },
    { merge: true },
  );
}

// يجيب كل محادثات مستخدم معيّن، مرتبة بالأحدث أول
export async function getUserConversations(
  userId: string,
): Promise<Conversation[]> {
  const q = query(
    collection(db, "conversations"),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Conversation);
}

// يجيب رسائل محادثة معيّنة
export async function getConversationMessages(
  conversationId: string,
): Promise<UIMessage[]> {
  const docSnap = await getDoc(
    doc(db, "conversations", conversationId, "data", "messages"),
  );
  if (!docSnap.exists()) return [];
  return JSON.parse(docSnap.data().messages);
}
