import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

const page = async ({ params }: ParamsProps) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const result = await getQuestionById({ questionId: id });
  if (result?.author?.clerkId !== userId) notFound();

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="edit"
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </div>
  );
};

export default page;
