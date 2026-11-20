import { getUserAnswers } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import AnswerCard from "../cards/AnswerCard";

interface Props {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ userId, clerkId }: Props) => {
  const result = await getUserAnswers({ userId, page: 1 });

  // console.log(result.answers);

  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswersTab;
