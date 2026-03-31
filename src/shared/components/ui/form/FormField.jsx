import './formLayout.css';

const FormField = ({ label, full, children }) => (
  <div className={`ui-form-field ${full ? 'ui-form-field-full' : ''}`.trim()}>
    <label className="ui-form-label">{label}</label>
    {children}
  </div>
);

export default FormField;
