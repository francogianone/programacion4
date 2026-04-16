import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <Link to="/" className="logo-link">
              <Package size={28} className="logo-icon" />
              <span>Librería Local</span>
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
