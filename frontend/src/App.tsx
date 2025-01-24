import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ClerkProvider } from "@clerk/react-router";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import CreateSpace from "./pages/CreateSpace";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-space" element={<CreateSpace />} />
          </Routes>
        </Layout>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;
