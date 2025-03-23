import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductSelector from "@/pages/ProductSelector";
import AdminPage from "@/pages/AdminPage";
import AdminRecords from "@/pages/AdminRecords";
import AdminItems from "@/pages/AdminItems";

function App() {
  return (
    <Router basename="/rc-kiosk-app">
      <Routes>
        <Route path="/" element={<ProductSelector />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/records" element={<AdminRecords />} />
        <Route path="/admin/items" element={<AdminItems />} />
      </Routes>
    </Router>
  );
}

export default App;
