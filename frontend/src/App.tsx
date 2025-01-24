import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import CreateSpace from "./pages/CreateSpace";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-space" element={<CreateSpace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
