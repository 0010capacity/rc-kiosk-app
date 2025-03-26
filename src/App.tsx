
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProductSelector from "@/pages/ProductSelector";
import AdminPage from "@/pages/AdminPage";
import AdminLogin from "@/pages/AdminLogin";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<ProductSelector />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
