import { useEffect, useState } from "react";
import Post from "./Post";

function Myblog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://blog-server-coral.vercel.app/myblog", {
      credentials: "include",
    }).then((response) => {
      response.json().then((post) => {
        setPosts(post);
      });
    });
  }, []);

  return (
    <>
      {posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
      {posts.length === 0 && (
        <h1 className="No">
          Currently, you have no posts. Why not start by creating your first one
          and sharing your story with the world?
        </h1>
      )}
    </>
  );
}
export default Myblog;
