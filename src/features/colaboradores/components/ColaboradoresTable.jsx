const ColaboradoresTable = ({ colaboradores, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Documento</th>
          <th style={styles.th}>Nombre completo</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Cesado</th>
        </tr>
      </thead>

      <tbody>
        {colaboradores.map((c, index) => (
          <tr
            key={c.id_colaborador}
            onClick={() => onSelect(c)}
            style={{
              ...styles.tr,
              background:
                selected?.id_colaborador === c.id_colaborador
                  ? '#afbbeaff'
                  : '#f4efefff'
            }}
          >
            <td style={styles.td}>{index + 1}</td>
            <td style={styles.td}>{c.documento}</td>
            <td style={styles.td}>{c.nombre_completo}</td>
            <td style={styles.td}>{c.email || '-'}</td>
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  background: c.activo ? '#e6f4ea' : '#fdecea',
                  color: c.activo ? '#1e7e34' : '#c82333'
                }}
              >
                {c.activo ? 'No' : 'Si'}
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
    background: '#b3b8b3ff'
  },
  tr: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  td: {
    textAlign: 'center',
    padding: '14px',
    color: '#111827'
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '999px',
    fontWeight: '600',
    fontSize: '12px'
  }
};

export default ColaboradoresTable;
