import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Components/Pages/login";
import Register from "./Components/Pages/register";
import { UserContextProvider } from "./UserContext";
import Create from "./Components/Pages/Create";
import IndexPage from "./Components/IndexPage";
import PostPage from "./Components/Pages/PostPage";
import EditPost from "./Components/Pages/EditPost";
import Myblog from "./Components/Pages/Myblog";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myblogs" element={<Myblog />}></Route>
          <Route path="/create" element={<Create />}></Route>
          <Route path="/post/:id" element={<PostPage />}></Route>
          <Route path="/edit/:id" element={<EditPost />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
