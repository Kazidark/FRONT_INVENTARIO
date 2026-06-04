/**
 * Toggle activo/inactivo — pastilla compacta para columnas Estado.
 */
const ActivoSwitchCell = ({ checked, disabled, onChange }) => {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Activo' : 'Inactivo'}
      tabIndex={disabled ? -1 : 0}
      className={`crud-status-toggle ${checked ? 'crud-status-toggle--on' : 'crud-status-toggle--off'}${disabled ? ' crud-status-toggle--disabled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="crud-status-toggle__track" aria-hidden="true">
        <span className="crud-status-toggle__thumb" />
      </span>
      <span className="crud-status-toggle__text">{checked ? 'Activo' : 'Inactivo'}</span>
    </div>
  );
};

export default ActivoSwitchCell;
