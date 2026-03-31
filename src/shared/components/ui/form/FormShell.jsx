import './formLayout.css';

const FormShell = ({ children, className = '' }) => (
  <div className={`ui-form-shell ${className}`.trim()}>
    {children}
  </div>
);

export default FormShell;
