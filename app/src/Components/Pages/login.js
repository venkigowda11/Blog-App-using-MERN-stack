import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { Link } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setDirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch("https://blog-server-coral.vercel.app/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      redirect: "follow",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setDirect(true);
      });
    } else {
      const errorMessage = await response.json();

      if (errorMessage === "Wrong username") {
        alert("Wrong username");
      } else if (errorMessage === "Wrong password") {
        alert("Wrong password");
      } else {
        alert("Unexpected error occurred");
      }
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
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
      <button className="authbtn">Login</button>
      <p style={{ color: "black", marginTop: "10px" }}>
        Don't Have an Account? <Link to={"/register"}>Sign up here</Link>
      </p>
    </form>
  );
}
export default LoginPage;
