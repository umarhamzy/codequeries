import Question from "@/components/forms/Question";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ask a Question | CodeQueries",
};

const page = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");


  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question />
      </div>
    </div>
  );
};

export default page;
