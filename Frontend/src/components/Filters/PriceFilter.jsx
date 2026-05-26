import './Filters.css';

function PriceFilter({ minValue, maxValue, sortOrder, onMinChange, onMaxChange, onSortChange }) {
  return (
    <div className="price-filter">
      <div className="price-inputs">
        <label>
          Min $
          <input
            type="number"
            className="price-input"
            value={minValue}
            min={0}
            placeholder="0"
            onChange={(e) => onMinChange(e.target.value)}
          />
        </label>
        <label>
          Max $
          <input
            type="number"
            className="price-input"
            value={maxValue}
            min={0}
            placeholder="Sin limite"
            onChange={(e) => onMaxChange(e.target.value)}
          />
        </label>
      </div>
      <div className="sort-buttons">
        <button
          className={`sort-btn${sortOrder === 'asc' ? ' sort-btn--active' : ''}`}
          onClick={() => onSortChange(sortOrder === 'asc' ? '' : 'asc')}
        >
          Menor a mayor
        </button>
        <button
          className={`sort-btn${sortOrder === 'desc' ? ' sort-btn--active' : ''}`}
          onClick={() => onSortChange(sortOrder === 'desc' ? '' : 'desc')}
        >
          Mayor a menor
        </button>
      </div>
    </div>
  );
}

export default PriceFilter;
