/* eslint-disable*/

import ReactQuill from "react-quill";
import { Navigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import { useEffect, useState } from "react";
function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentC, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [urlC, setUrlC] = useState("");

  useEffect(() => {
    fetch("https://blog-server-coral.vercel.app/post/" + id)
      .then((response) => response.json())
      .then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setUrlC(postInfo.url || "");
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();

    let urlCToUpdate = urlC;

    if (files?.[0]) {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "uploads");

      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/dvfua7glr/image/upload",
        {
          method: "PUT",
          body: data,
        }
      );
      const uploadResJson = await uploadRes.json();
      urlCToUpdate = uploadResJson.url;
    }

    try {
      const response = await fetch(
        "https://blog-server-coral.vercel.app/post",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            summary,
            contentC,
            urlC: urlCToUpdate,
            id,
          }),
          credentials: "include",
        }
      );
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
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <ReactQuill
        value={contentC}
        onChange={(newValue) => setContent(newValue)}
      />
      <button style={{ marginTop: "10px" }} className="authbtn">
        Update Post
      </button>
    </form>
  );
}
export default EditPost;
