/* eslint-disable */
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <a href="/" className="logo">
        Blogger
      </a>
      <nav>
        {username && (
          <>
            <span
              className="hello"
              style={{ marginRight: "30px", color: "#706F5E" }}
            >
              Hello, {username}
            </span>
            <Link to="/create">Create Post</Link>
            <Link onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
export default Header;
