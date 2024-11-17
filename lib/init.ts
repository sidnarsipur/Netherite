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
  apiKey:
    "pcsk_MhrCv_Bz9nnEFuBtBAN1NrX8FZfiAYe1j2sMpoNTFcyUAT3NvQXijF847XnmWxsnbXEbz",
});
export const index = pc.Index("embeddings");
export const model = "multilingual-e5-large";

export const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyCAHS9TwEI_pFpwsS7s3zrFKto7FETOao8",
});

export const sysPrompt = `
You are a note-summarizer. You will be provided with a series of notes, and you must summarize them. Each note will be seperated by 'NEW NOTE'.
Be detailed but do not include unnecessary information. 
Create appropriate headings (using **Text you want bulleted**) where neccesary. 
`;
