/* eslint-disable*/

import ReactQuill from "react-quill";
import { Navigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import { useEffect, useState } from "react";
function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [summary, setSummary] = useState();
  const [content, setContent] = useState();
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("blog-app-ten-ebon.vercel.app/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    data.set("id", id);
    try {
      const response = await fetch("blog-app-ten-ebon.vercel.app/post", {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.log("Error during fetch:", error);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button style={{ marginTop: "10px" }}>update Post</button>
    </form>
  );
}
export default EditPost;
