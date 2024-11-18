import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Pinecone } from "@pinecone-database/pinecone";
import { getAuth } from "firebase-admin/auth";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

var admin = require("firebase-admin");
var serviceAccount = require("./service_account_key.json");

if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = getAuth();
export const db = getFirestore();
export const pc = new Pinecone({
  apiKey: "",
});
export const index = pc.Index("embeddings");
export const model = "multilingual-e5-large";

export const google = createGoogleGenerativeAI({
  apiKey: "",
});

export const sysPrompt = `
You are a note-summarizer. You will be provided with a series of notes, and you must summarize them.
Be detailed but do not include unnecessary information. 
Give me html, using tags for h1, h2, h3, bold, italics and bulleted lists.
Don't use any spaces between tags. Espeically for lists, do </li><li> not for a new item.
`;
