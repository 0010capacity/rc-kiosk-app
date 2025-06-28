import './index.css'; // ✅ Tailwind CSS 연결
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ProductSelector from './pages/ProductSelector';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/location/:locationId" element={<ProductSelector />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
