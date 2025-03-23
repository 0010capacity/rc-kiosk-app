import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProductSelector from "@/pages/ProductSelector";
import AdminPage from "@/pages/AdminPage";
import AdminRecords from "@/pages/AdminRecords";
import AdminItems from "@/pages/AdminItems";

function App() {
  return (
    <Router basename="/">
      import AdminLogin from "@/pages/AdminLogin";

<Routes>
        <Route path="/" element={<ProductSelector />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/records" element={<AdminRecords />} />
        <Route path="/admin/items" element={<AdminItems />} />
      </Routes>
    </Router>
  );
}

export default App;
