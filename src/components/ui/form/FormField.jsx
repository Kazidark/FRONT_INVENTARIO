const FormField = ({ label, full, children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      gridColumn: full ? '1 / -1' : undefined
    }}
  >
    <label style={{ fontSize: 13, fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

export default FormField;
