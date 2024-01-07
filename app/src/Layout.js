import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Pages/Footer";

export default function Layout() {
  return (
    <div className="wrapper">
      <main>
        <Header />
        <div className="blogs">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
