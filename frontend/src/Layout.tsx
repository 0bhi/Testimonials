import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();
  const isPublicTestimonialPage = location.pathname.startsWith("/testimonial/");

  return (
    <div>
      {!isPublicTestimonialPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isPublicTestimonialPage && <Footer />}
    </div>
  );
};

export default Layout;
