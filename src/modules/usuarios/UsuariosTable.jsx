const UsuariosTable = ({ usuarios, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {['Usuario', 'Correo', 'Rol', 'Estado'].map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {usuarios.map(u => (
          <tr
            key={u.id_usuario}
            onClick={() => onSelect(u)}
            style={{
              ...styles.tr,
              background:
                selected?.id_usuario === u.id_usuario ? '#e0f2fe' : '#ffffff'
            }}
          >
            <td style={styles.td}>{u.usuario}</td>
            <td style={styles.td}>{u.email}</td>
            <td style={styles.td}>{u.rol}</td>
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  background: u.activo ? '#dcfce7' : '#fee2e2',
                  color: u.activo ? '#166534' : '#991b1b'
                }}
              >
                {u.activo ? 'Activo' : 'Cesado'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    fontSize: '14px'
  },
  th: {
    textAlign: 'center',
    padding: '12px',
    fontWeight: '600',
    background: '#cdcdcd'
  },
  tr: {
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  td: {
    textAlign: 'center',
    padding: '14px'
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '999px',
    fontWeight: '600',
    fontSize: '12px'
  }
};

export default UsuariosTable;

