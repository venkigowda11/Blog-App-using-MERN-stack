import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

export default function Create() {
  const [title, setTitle] = useState();
  const [summary, setSummary] = useState();
  const [content, setContent] = useState();
  const [files, setFile] = useState();
  const [redirect, setRedirect] = useState(false);

  async function createNew(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files);
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    console.log(response);
    if (response.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <form action="" onSubmit={createNew}>
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
      <input type="file" onChange={(ev) => setFile(ev.target.files[0])} />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button style={{ marginTop: "10px" }}>Create a Post</button>
    </form>
  );
}
