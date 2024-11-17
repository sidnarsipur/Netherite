"use server";
import { auth } from "./init"; // Assuming auth is correctly initialized

export async function createUser(formData: FormData) {
  try {
    console.log(formData);
    // Extracting form data correctly
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = (formData.get("displayName") as string) || "Henry LOO"; // Optional

    // Validate email and password
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: displayName,
      disabled: false, // Set to `true` if you want to disable the user account
    });

    console.log("Successfully created new user:", userRecord.uid);
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new Error("User creation failed");
  }
}
