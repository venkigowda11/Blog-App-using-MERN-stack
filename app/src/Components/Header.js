/* eslint-disable */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://blog-app-ten-ebon.vercel.app/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const userData = await response.json();
        setUserInfo(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function logout() {
    fetch("https://blog-app-ten-ebon.vercel.app/logout", {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null);
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Blogger
      </Link>
      <nav>
        <>
          {username && (
            <>
              <span
                className="hello"
                style={{ marginRight: "30px", color: "#706F5E" }}
              >
                Hello {username}
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
        </>
        {loading ? <p>Loading...</p> : ""}
      </nav>
    </header>
  );
}
export default Header;
