import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function regist(e) {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    const response = await fetch(
      "https://blog-server-coral.vercel.app/register",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 200) {
      alert("Registration succesfull");
      navigate("/login");
    } else {
      alert("Username taken, Try other name");
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
      <button className="authbtn">Register</button>
    </form>
  );
}
export default Register;
