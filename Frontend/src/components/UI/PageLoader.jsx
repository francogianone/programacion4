import './PageLoader.css';

/**
 * PageLoader — estado de carga a pantalla completa (sin desplazar el footer)
 * @param {string} text - texto opcional bajo el spinner
 */
function PageLoader({ text = 'Cargando...' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__spinner" aria-hidden="true">
        <div className="page-loader__ring" />
      </div>
      <p className="page-loader__text">{text}</p>
    </div>
  );
}

/**
 * PageError — estado de error inline que respeta el layout
 */
function PageError({ text = 'Ocurrió un error.' }) {
  return (
    <div className="page-error" role="alert">
      <p className="page-error__text">{text}</p>
    </div>
  );
}

export { PageLoader, PageError };
