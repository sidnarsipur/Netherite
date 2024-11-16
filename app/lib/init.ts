import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Pinecone } from '@pinecone-database/pinecone';
import { getAuth } from "firebase-admin/auth";

var admin = require("firebase-admin");
var serviceAccount = require("./service_account_key.json");

if(!getApps().length){
    initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const auth = getAuth()
export const db = getFirestore();
export const pc = new Pinecone({ apiKey: "pcsk_MhrCv_Bz9nnEFuBtBAN1NrX8FZfiAYe1j2sMpoNTFcyUAT3NvQXijF847XnmWxsnbXEbz" });