const FormShell = ({ children }) => {
  return (
    <div style={styles.shell}>
      {children}
    </div>
  );
};

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    borderRadius: 26,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    background: '#fff'
  }
};

export default FormShell;
