import { useComments } from "../../api/queries/comment.query";
import CommentItem from "../CommentItem";

const CommentList = ({ taskId }) => {
  const { data: comments = [], isLoading } = useComments(taskId);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} />
      ))}
    </div>
  );
};

export default CommentList;
