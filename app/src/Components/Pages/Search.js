/* eslint-disable*/

import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import Post from "./Post";

function Search() {
  const { search } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setLoading(true);
    const timeoutId = setTimeout(() => {
      fetch(`https://blog-server-coral.vercel.app/search?q=${search}`)
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setLoading(false);
        });
    }, 500);

    setSearchTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [search]);
  return (
    <>
      {loading && <h1 className="No">Loading...</h1>}
      {!loading && posts.length === 0 && <h1 className="No">No posts !!!</h1>}
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
}

export default Search;
