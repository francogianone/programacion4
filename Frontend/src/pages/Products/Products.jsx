import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../../components/Cards/ProductCard';
import CategoryFilter from '../../components/Filters/CategoryFilter';
import SearchBar from '../../components/Filters/SearchBar';
import PriceFilter from '../../components/Filters/PriceFilter';
import './Products.css';
import '../../components/Filters/Filters.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/productos`)
      .then(res => {
        const data = res.data;
        setProducts(Array.isArray(data) ? data : data.productos ?? data.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.categoria))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((p) => p.nombre.toLowerCase().includes(term));
    }

    if (priceMin !== '') {
      result = result.filter((p) => p.precio >= Number(priceMin));
    }

    if (priceMax !== '') {
      result = result.filter((p) => p.precio <= Number(priceMax));
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.precio - a.precio);
    }

    return result;
  }, [products, selectedCategory, searchTerm, priceMin, priceMax, sortOrder]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-page">
      <div className="filter-bar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <PriceFilter
          minValue={priceMin}
          maxValue={priceMax}
          sortOrder={sortOrder}
          onMinChange={setPriceMin}
          onMaxChange={setPriceMax}
          onSortChange={setSortOrder}
        />
      </div>
      <div className="products-container">
        {filteredProducts.length === 0 ? (
          <p className="products-empty">No se encontraron productos con los filtros aplicados.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              nombre={product.nombre}
              precio={product.precio}
              categoria={product.categoria}
              descripcion={product.descripcion}
              imagen={product.imagen}
              stock={product.stock}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;