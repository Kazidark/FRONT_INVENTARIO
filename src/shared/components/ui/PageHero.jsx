/**
 * Encabezado de página para módulos de inventario.
 */
const PageHero = ({ title, subtitle, children }) => (
  <header className="inv-page-hero">
    <span className="inv-page-hero__accent" aria-hidden="true" />
    <div className="inv-page-hero__body">
      <h1 className="inv-page-hero__title">{title}</h1>
      {subtitle ? <p className="inv-page-hero__subtitle">{subtitle}</p> : null}
    </div>
    {children ? <div className="inv-page-hero__stats">{children}</div> : null}
  </header>
);

export default PageHero;
