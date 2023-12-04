import { useState } from "react";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function regist(e) {
    e.preventDefault();
    const response = await fetch(
      "https://blog-app-ten-ebon.vercel.app//register",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 200) {
      alert("Registration succesfull");
    } else {
      alert("Failed");
    }
  }
  return (
    <form className="register" onSubmit={regist}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="user name"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
export default Register;
