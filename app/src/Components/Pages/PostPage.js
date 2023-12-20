/* eslint-disable*/
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../../UserContext";
import { Link } from "react-router-dom";

function PostPage() {
  const { userInfo } = useContext(UserContext);
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://blog-server-coral.vercel.app/post/${id}`).then(
      (response) => {
        response.json().then((postInfo) => {
          setPostInfo(postInfo);
        });
      }
    );
  }, []);
  const handleDelete = () => {
    fetch(`https://blog-server-coral.vercel.app/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          navigate("/");
        } else {
          console.error("Failed to delete the post");
        }
      })
      .catch((error) => {
        console.error("Error deleting the post:", error);
      });
  };
  if (!postInfo) return "";

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time className="time">
        {formatISO9075(new Date(postInfo.createdAt))}
      </time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit this post
          </Link>
          <button className="delete-btn" onClick={handleDelete}>
            Delete this post
          </button>
        </div>
      )}
      <div className="edit-row">
        <a className=""></a>
      </div>
      <div className="image">
        <img src={postInfo.url} alt="" />
      </div>
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></div>
    </div>
  );
}
export default PostPage;
