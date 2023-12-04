import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

export default function Create() {
  const [title, setTitle] = useState();
  const [summary, setSummary] = useState();
  const [contentC, setContent] = useState();
  const [file, setFile] = useState();
  const [redirect, setRedirect] = useState(false);

  async function createNew(ev) {
    const data1 = new FormData();

    data1.append("file", file);
    data1.append("upload_preset", "uploads");
    ev.preventDefault();
    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dvfua7glr/image/upload",
      {
        method: "POST",
        body: data1,
      }
    );
    const uploadResJson = await uploadRes.json();

    const { url } = uploadResJson;
    const urlC = url;
    console.log(url);

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, summary, contentC, urlC }),
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
        value={contentC}
        onChange={(newValue) => setContent(newValue)}
      />
      <button style={{ marginTop: "10px" }}>Create a Post</button>
    </form>
  );
}
