"use server";
import { auth, db } from "./init"; // Assuming auth is correctly initialized
import { User } from "./model";
import { addFolder } from "./note-manager";

export async function createUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = (formData.get("displayName") as string) || "Henry LOO"; // Optional

    // Validate email and password
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Create user in Firebase Authentication
    const userRecord = await db.collection("users").add({
      email: email,
      emailVerified: false,
      password: password,
      displayName: displayName,
      disabled: false, // Set to `true` if you want to disable the user account
    });

    // add the root folder
    const folderRef = db
      .collection("users")
      .doc(userRecord.id)
      .collection("folders");

    await folderRef.add({
      path: "/",
      noteIDs: [],
      name: "",
    });

    console.log("Successfully created new user:", userRecord.id);
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new Error("User creation failed");
  }
}

const userID = "p08IOziatZeJjDp9U35box6xxQy2";
export async function getCurrentUserSnapshot() {
  const user = await db.collection("users").doc(userID).get();
  return user;
}

export async function getCurrentUser() {
  const user = (await getCurrentUserSnapshot()).data();
  return {
    id: userID,
    ...user,
  } as User;
}
