import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductSelector from "./pages/ProductSelector";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router basename="/rc-kiosk-app">
      <Routes>
        <Route path="/" element={<ProductSelector />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;