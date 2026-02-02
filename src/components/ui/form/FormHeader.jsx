const FormHeader = ({ title, gradient }) => {
  return (
    <aside
      style={{
        padding: 28,
        color: '#fff',
        background: gradient || 'linear-gradient(180deg,#2563eb,#1e40af)'
      }}
    >
      <h3 style={{ margin: 0, fontWeight: 600 }}>{title}</h3>
    </aside>
  );
};

export default FormHeader;
