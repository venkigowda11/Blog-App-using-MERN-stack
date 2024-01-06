import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

export default function Layout() {
  return (
    <main>
      <Header />
      <div className="blogs">
        <Outlet />
      </div>
    </main>
  );
}
