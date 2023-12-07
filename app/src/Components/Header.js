/* eslint-disable */
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "https://blog-app-ten-ebon.vercel.app/profile",
          {
            credentials: "include",
            method: "GET",
          }
        );

        if (response.ok) {
          const userInfo = await response.json();
          console.log("User info fetched:", userInfo);
          setUserInfo(userInfo);
        } else {
          console.log("Failed to fetch user info. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    const checkTokenAndFetchUserInfo = async () => {
      const storedToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      console.log("Stored token:", storedToken);

      if (storedToken) {
        await fetchUserInfo();
      }
    };

    checkTokenAndFetchUserInfo();
  }, []);

  function logout() {
    fetch("https://blog-app-ten-ebon.vercel.app/logout", {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null);
      navigate("/");
      window.location.reload();
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Blogger
      </Link>
      <nav>
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
      </nav>
    </header>
  );
}
export default Header;
