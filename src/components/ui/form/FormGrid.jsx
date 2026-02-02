const FormGrid = ({ children }) => (
  <div style={styles.grid}>{children}</div>
);

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 22
  }
};

export default FormGrid;
