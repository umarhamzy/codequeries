import { readSearchParams } from "@/lib/utils";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams: query }: URLProps) => {
  const { id } = await params;
  const searchParams = await readSearchParams(query);
  const result = await getQuestionsByTagId({
    tagId: id,
    searchQuery: searchParams.q,
  });

  // console.log(result);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">
        {result.tagTitle}
      </h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={`/tags/${id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search starred questions.."
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title={`There are no questions with "${result.tagTitle}" tag!`}
            description="Ask a question with this tag to see it here!"
            link="/"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
