const CelularesTable = ({ celulares, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Marca</th>
          <th style={styles.th}>Modelo</th>
          <th style={styles.th}>IMEI</th>
          <th style={styles.th}>Estado Celular</th>
          <th style={styles.th}>Estado Equipo</th>
          <th style={styles.th}>Área</th>
          <th style={styles.th}>Colaborador</th>
          
          <th style={styles.th}>Chip</th>
          <th style={styles.th}>Activo</th>
        </tr>
      </thead>

      <tbody>
        {celulares.length === 0 ? (
          <tr>
            <td colSpan="8" style={styles.empty}>
              No hay celulares registrados
            </td>
          </tr>
        ) : (
          celulares.map((c) => (
            <tr
              key={c.id_celular}
              onClick={() => onSelect(c)}
              style={{
                ...styles.tr,
                background:
                  selected?.id_celular === c.id_celular
                    ?'#afbbeaff' : '#f4efefff'
              }}
            >
              <td style={styles.td}>{c.marca}</td>
              <td style={styles.td}>{c.modelo}</td>
              <td style={styles.td}>{c.imei_celular}</td>
              <td style={styles.td}>{c.estado_celular}</td>
              <td style={styles.td}>{c.estado_equipo}</td>
              <td style={styles.td}>{c.nombre_area || ''}</td>
              <td style={styles.td}>{c.usuario || ''}</td>
                            
              <td>{c.numero_chip ? `${c.numero_chip}`:''}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    background: c.activo ? '#e6f4ea' : '#fdecea',
                    color: c.activo ? '#1e7e34' : '#c82333'
                  }}
                >
                  {c.activo ? 'Si' : 'No'}
                </span>
              </td>
              
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    fontSize: 14
  },
  th: {
    textAlign: 'center',
    padding: 12,
    background: '#b3b8b3ff', // encabezado
    fontWeight: 600
  },
  tr: {
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: 10
  },
  td: {
    textAlign: 'center',
    padding: 14,
    background: 'transparent'
  },
  badge: {
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600
  },
  empty: {
    padding: 30,
    textAlign: 'center',
    color: '#6b7280'
  }
};

export default CelularesTable;
