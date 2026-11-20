import { readSearchParams } from "@/lib/utils";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection | CodeQueries",
};

const page = async ({ searchParams: query }: SearchParamsProps) => {
  const searchParams = await readSearchParams(query);
  const { userId } = await auth();

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  // console.log(result.questions);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Starred Questions</h1>

      <div className="mt-11 flex flex-wrap justify-between gap-5 sm:items-center">
        <LocalSearch
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search starred questions.."
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] min-w-[170px]"
          placeholder="Sort by.."
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
            title="Star questions to see them here!"
            description="Click on the star icon to star a question. 🌟"
            link="/"
            linkTitle="Browse Questions"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default page;
