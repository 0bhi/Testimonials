import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ClerkProvider } from "@clerk/react-router";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import CreateSpace from "./pages/CreateSpace";
import SpacePage from "./pages/SpacePage";
import Testimonial from "./pages/Testimonial";
import EmbedTestimonials from "./pages/EmbedTestimonials";
import EmbedLayout from "./embedLayout";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-space" element={<CreateSpace />} />
            <Route path="/space/:spaceName" element={<SpacePage />} />
            <Route path="/:spaceName" element={<Testimonial />} />
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
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;
