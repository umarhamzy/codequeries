import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook

  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const {
      id,
      email_addresses,
      primary_email_address_id,
      image_url,
      username,
      first_name,
      last_name,
    } = evt.data;
    const email =
      email_addresses.find(({ id }) => id === primary_email_address_id) ??
      email_addresses[0];
    const profile = {
      name: [first_name, last_name].filter(Boolean).join(" "),
      username,
      email: email?.email_address,
      picture: image_url,
    };

    await connectToDatabase();
    if (evt.type === "user.created") {
      await User.updateOne(
        { clerkId: id },
        { $setOnInsert: { clerkId: id, ...profile } },
        { upsert: true },
      );
    } else {
      await User.updateOne({ clerkId: id }, { $set: profile });
    }
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (!id) return new Response("Missing user ID", { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ clerkId: id });
    if (user) {
      await Question.deleteMany({ author: user._id });
      await User.deleteOne({ _id: user._id });
    }
  }

  return NextResponse.json({ message: "OK" });
}
