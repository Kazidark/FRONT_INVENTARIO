import './formLayout.css';

const FormHeader = ({
  title,
  info = [],
  gradient = 'linear-gradient(180deg,#36ad55,#115e59)'
}) => (
  <aside className="ui-form-side" style={{ background: gradient }}>
    <h3 className="ui-form-side-title">{title}</h3>
    {info.map((item) => (
      <div key={item.label} className="ui-form-side-info">
        <span>{item.label}</span>
        <strong>{item.value || '—'}</strong>
      </div>
    ))}
  </aside>
);

export default FormHeader;
