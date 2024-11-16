import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Pinecone } from '@pinecone-database/pinecone';
import { getAuth } from "firebase-admin/auth";
import { createGoogleGenerativeAI } from '@ai-sdk/google';

var admin = require("firebase-admin");
var serviceAccount = require("./service_account_key.json");

if(!getApps().length){
    initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export const auth = getAuth()

export const db = getFirestore();

export const pc = new Pinecone({ apiKey: "" });
export const index = pc.index('embeddings');
export const model = 'multilingual-e5-large';

export const google = createGoogleGenerativeAI({
    apiKey: ""
})  

export const sysPrompt = "This is the standard system prompt for now";