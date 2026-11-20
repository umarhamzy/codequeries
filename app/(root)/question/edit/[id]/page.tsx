import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: ParamsProps) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: id });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          mongoUser={JSON.stringify(mongoUser._id)}
          type="edit"
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </div>
  );
};

export default page;
