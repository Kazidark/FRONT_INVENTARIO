const FormActions = ({ children }) => (
  <div style={styles.actions}>{children}</div>
);

const styles = {
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 30
  }
};

export default FormActions;
