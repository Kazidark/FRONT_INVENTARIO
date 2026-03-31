import './formLayout.css';

const FormInputWithIcon = ({ icon, children }) => (
  <div className="ui-form-input-wrap">
    <span className="ui-form-input-icon">{icon}</span>
    {children}
  </div>
);

export default FormInputWithIcon;
