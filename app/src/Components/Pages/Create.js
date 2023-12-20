import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import "../../App.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

export default function Create() {
  const [title, setTitle] = useState();
  const [summary, setSummary] = useState();
  const [contentC, setContent] = useState();
  const [file, setFile] = useState();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  async function createNew(ev) {
    const data1 = new FormData();
    data1.append("file", file);
    data1.append("upload_preset", "uploads");
    ev.preventDefault();

    if (!title || !summary || !contentC || !file) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

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

    const response = await fetch("https://blog-server-coral.vercel.app/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, summary, contentC, urlC }),
      credentials: "include",
    });

    console.log(url);
    console.log(response);

    setLoading(false);

    if (response.ok) {
      setRedirect(true);
    }
  }
  if (loading) {
    return <p>Posting...</p>;
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
        theme={"snow"}
        modules={modules}
      />
      <button style={{ marginTop: "10px" }} className="authbtn">
        Create a Post
      </button>
    </form>
  );
}
