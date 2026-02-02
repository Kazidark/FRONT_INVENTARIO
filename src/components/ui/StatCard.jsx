const StatCard = ({ label, value }) => {
  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <span style={styles.label}>{label}</span>
        <span style={styles.value}>{value}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#ffffff',
    padding: '18px 26px',
    borderRadius: '14px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    minWidth: '180px'
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  label: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  },

  value: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1.2'
  }
};

export default StatCard;
