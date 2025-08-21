import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import CreateSpace from "./pages/CreateSpace";
import SpacePage from "./pages/SpacePage";
import Testimonial from "./pages/Testimonial";
import EmbedTestimonials from "./pages/EmbedTestimonials";
import EmbedLayout from "./EmbedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/create-space"
              element={<ProtectedRoute element={<CreateSpace />} />}
            />
            <Route
              path="/space/:spaceName"
              element={<ProtectedRoute element={<SpacePage />} />}
            />
            <Route path="/testimonial/:spaceName" element={<Testimonial />} />
          </Route>
          <Route
            path="/embed/testimonials/:spaceName"
            element={
              <EmbedLayout>
                <EmbedTestimonials />
              </EmbedLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
