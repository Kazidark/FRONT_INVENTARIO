import './formLayout.css';

const renderFieldIcon = (icon) => {
  if (!icon) return null;
  if (typeof icon === 'string') {
    if (icon.startsWith('pi ') || icon.startsWith('pi-')) {
      const className = icon.startsWith('pi ') ? icon : `pi ${icon}`;
      return <i className={className} />;
    }
    return <span className="ui-form-label-emoji">{icon}</span>;
  }
  return icon;
};

const FormField = ({ label, full, icon, children }) => (
  <div className={`ui-form-field ${full ? 'ui-form-field-full' : ''}`.trim()}>
    <label className="ui-form-label">
      {icon ? <span className="ui-form-label-icon">{renderFieldIcon(icon)}</span> : null}
      <span>{label}</span>
    </label>
    {children}
  </div>
);

export default FormField;
