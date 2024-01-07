/* eslint-disable */
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://blog-server-coral.vercel.app/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const userData = await response.json();
        setUserInfo(userData);
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function logout() {
    try {
      await fetch("https://blog-server-coral.vercel.app/logout", {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const username = userInfo?.username;

  return (
    <>
      <header>
        <Link to="/" className="logo">
          BLOGGER
        </Link>
        <div className="myblog">
          <Link to="/" className="middle">
            All BLOGS
          </Link>
          {username && (
            <>
              <div className="dash">|</div>
              <Link to="/myblogs" className="middle">
                MY BLOGS
              </Link>
            </>
          )}
        </div>
        <nav>
          <>
            {username && (
              <>
                <span
                  className="hello"
                  style={{ marginRight: "30px", color: "#706F5E" }}
                >
                  Hello <span className="username">{username}</span>
                </span>
                <Link to="/create" className="after-login">
                  Create Post
                </Link>
                <Link onClick={logout} className="after-login">
                  Logout
                </Link>
              </>
            )}
            {!username && (
              <>
                <Link to="/login" className="auth-btn">
                  Login
                </Link>
                <Link to="/register" className="auth-btn">
                  Register
                </Link>
              </>
            )}
          </>
        </nav>
      </header>

      <div className="loading-container">
        {loading ? <p className="loading">Loading...</p> : ""}
      </div>
    </>
  );
}
export default Header;
