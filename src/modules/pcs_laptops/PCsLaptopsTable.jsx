const PCsLaptopsTable = ({ pcs, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Tipo</th>
          <th style={styles.th}>Marca</th>
          <th style={styles.th}>Modelo</th>
          <th style={styles.th}>Serie</th>
          <th style={styles.th}>Estado PC</th>
          <th style={styles.th}>Estado Equipo</th>
          <th style={styles.th}>Área</th>
          <th style={styles.th}>Usuario</th>
          <th style={styles.th}>Ubicación</th>
          <th style={styles.th}>Observaciones</th>
          <th style={styles.th}>Anexo</th>
          <th style={styles.th}>Activo</th>
        </tr>
      </thead>

      <tbody>
        {pcs.map((p) => {
          const isSelected = selected?.id_pc === p.id_pc;

          return (
            <tr
              key={p.id_pc}
              onClick={() => onSelect(p)}
              style={{
                ...styles.tr,
                ...(isSelected ? styles.selectedRow : styles.normalRow)
              }}
            >
              <td style={styles.td}>{p.tipo_equipo}</td>
              <td style={styles.td}>{p.marca}</td>
              <td style={styles.td}>{p.modelo}</td>
              <td style={styles.td}>{p.serie}</td>
              <td style={styles.td}>{p.estado_pc}</td>
              <td style={styles.td}>{p.estado_equipo}</td>
              <td style={styles.td}>{p.nombre_area || '-'}</td>
              <td style={styles.td}>{p.usuario || '-'}</td>
              <td style={styles.td}>{p.ubicacion || '-'}</td>
              <td style={styles.td}>{p.observaciones || '-'}</td>
              <td style={styles.td}>{p.anexo || '-'}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    background: p.activo ? '#e6f4ea' : '#fdecea',
                    color: p.activo ? '#1e7e34' : '#c82333'
                  }}
                >
                  {p.activo ? 'Si' : 'No'}
                </span>
              </td>
            </tr>
          );
        })}
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
    color: '#374151',
    fontWeight: '600',
    background: '#b3b8b3ff', // encabezado
  },
  tr: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '10px'
  },
  normalRow: {
    background: '#f4efefff'
  },
  selectedRow: {
    background: '#afbbeaff', // azul claro (selección)
    boxShadow: '0 6px 18px rgba(37, 99, 235, 0.25)',
    fontWeight: '600'
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

export default PCsLaptopsTable;
