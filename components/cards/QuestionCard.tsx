import RenderTag from "../shared/RenderTag";
import Link from "next/link";
import Metric from "../shared/Metric";
import { formatBigNumber, getTimestamp } from "@/lib/utils";
import { Show } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionProps {
  _id: string;
  clerkId?: string | null;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId: string;
    username: string;
    name: string;
    picture: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = async ({
  _id,
  clerkId,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>

        <Show when="signed-in">
          {showActionButtons && (
            <EditDeleteAction type="question" itemId={JSON.stringify(_id)} />
          )}
        </Show>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.username}
          title={` - ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="small-medium text-dark400_light700"
        />

        <div className="flex items-center gap-4 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={formatBigNumber(upvotes.length)}
            title={`${upvotes.length === 1 ? " upvote" : " upvotes"}`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatBigNumber(answers.length)}
            title={`${answers.length === 1 ? " answer" : " answers"}`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatBigNumber(views)}
            title={`${views > 1 ? " views" : " view"}`}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
