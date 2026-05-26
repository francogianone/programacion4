import './Filters.css';

function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="category-filter">
      <button
        className={`pill${selected === '' ? ' pill--active' : ''}`}
        onClick={() => onChange('')}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`pill${selected === cat ? ' pill--active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
