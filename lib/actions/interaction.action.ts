"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import { requireCurrentUser } from "@/lib/current-user";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const { questionId, userId } = params;
    const user = userId ? await requireCurrentUser() : null;
    await connectToDatabase();

    // Update view count for the question

    await Question.findByIdAndUpdate(questionId, {
      // increment
      $inc: {
        views: 1,
      },
    });

    // Check for existing interaction of UserId exists (userId could exist on a different action that isn't view.)
    if (user) {
      const existingInteraction = await Interaction.findOne({
        user: user._id,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return; // console.log("User has already viewed");

      // Create interaction
      await Interaction.create({
        user: user._id,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
