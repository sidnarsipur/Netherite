"use server";
import { db } from "../note/init"; // Assuming auth is correctly initialized
import { User } from "../util/model";
import { currentUser } from "@clerk/nextjs/server";

export async function createUser() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("No user found");
    }

    if (!user.primaryEmailAddress) {
      throw new Error("No email found");
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", user.primaryEmailAddress?.emailAddress)
      .get();

    if (!userSnapshot.empty) {
      console.error("User already exists");
      return;
    }

    const userRecord = await db.collection("users").add({
      name: user.fullName || "",
      email: user.primaryEmailAddress,
      emailVerified: false,
      displayName: name,
      disabled: false,
    });

    const folderRef = db
      .collection("users")
      .doc(userRecord.id)
      .collection("folders");

    await folderRef.add({
      path: "/",
      noteIDs: [],
      name: "",
    });

    return userRecord;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new Error("User creation failed");
  }
}

export async function getCurrentUserSnapshot() {
  const user = await currentUser();

  if (!user) {
    throw new Error("No user found");
  }

  const userSnapshot = await db
    .collection("users")
    .where("email", "==", user.primaryEmailAddress?.emailAddress)
    .get();

  return userSnapshot.docs[0];
}

export async function getCurrentUser() {
  const user = await getCurrentUserSnapshot();

  if (user.data() === undefined) {
    throw new Error("No user found");
  }

  const useRet = {
    id: user.id,
    ...user.data(),
  } as User;

  console.log(useRet, user.id);

  return useRet;
}
