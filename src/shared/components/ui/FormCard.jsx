const FormCard = ({ title, children }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      {children}
    </div>
  );
};

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
  },
  title: {
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  }
};

export default FormCard;
