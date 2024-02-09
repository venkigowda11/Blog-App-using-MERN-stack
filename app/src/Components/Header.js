/* eslint-disable */
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setSearch } = useContext(UserContext);

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
  const handleSearch = (e) => {
    setSearch(e.target.value);
    navigate("/search");
  };

  const handleKeyUp = (e) => {
    if (e.key === "Backspace" && e.target.value === "") {
      navigate("/");
    }
  };

  const username = userInfo?.username;

  return (
    <>
      <header>
        <div className="search">
          <Link to="/" className="logo">
            BLOGGER
          </Link>
          <input
            className="query"
            type="text"
            onChange={handleSearch}
            placeholder="Search Blogs..."
            onKeyUp={handleKeyUp}
          />
        </div>
        <Link to="/" className="middle">
          ALL BLOGS
        </Link>
        {username && (
          <>
            <Link to="/myblogs" className="middle">
              MY BLOGS
            </Link>
          </>
        )}

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
      <hr className="hr" />
      <div className="loading-container">
        {loading ? <p className="loading">Loading...</p> : ""}
      </div>
    </>
  );
}
export default Header;
