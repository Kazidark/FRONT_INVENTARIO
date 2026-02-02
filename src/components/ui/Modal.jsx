const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.close}>✖</button>
        {children}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    background: '#fff',
    padding: '25px',
    borderRadius: '10px',
    minWidth: '420px'
  },
  close: {
    float: 'right',
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    cursor: 'pointer'
  }
};

export default Modal;
