import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductSelector from './pages/ProductSelector';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ProductSelector />
    </HashRouter>
  </React.StrictMode>,
);
