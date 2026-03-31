import { Dialog } from 'primereact/dialog';

const Modal = ({ open, onClose, title, width = 'min(920px, 92vw)', children }) => {
  return (
    <Dialog
      header={title}
      visible={open}
      onHide={onClose}
      style={{ width }}
      modal
      draggable={false}
      resizable={false}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
