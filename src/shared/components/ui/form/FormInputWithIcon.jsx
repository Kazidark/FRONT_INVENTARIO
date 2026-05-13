import './formLayout.css';

/** Contenedor del control; el icono va en `FormField` (prop `icon`), no dentro del input. */
const FormInputWithIcon = ({ children }) => (
  <div className="ui-form-input-wrap">{children}</div>
);

export default FormInputWithIcon;
