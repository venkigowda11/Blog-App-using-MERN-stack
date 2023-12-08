/* eslint-disable */
import { useEffect, useState } from "react";
import Posts from "./Pages/Post";
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://blog-server-coral.vercel.app/post").then((response) => {
      response.json().then((post) => {
        setPosts(post);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((post) => <Posts {...post} />)}</>;
}
