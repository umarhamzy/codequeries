import { auth } from "@clerk/nextjs/server";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function requireCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: User not logged in");

  await connectToDatabase();
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw new Error("User profile not found");
  return user;
}
