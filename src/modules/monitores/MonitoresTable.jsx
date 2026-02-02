const MonitoresTable = ({ monitores, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Serie</th>
          <th style={styles.th}>Marca</th>
          <th style={styles.th}>Modelo</th>
          <th style={styles.th}>Estado Equipo</th>
          <th style={styles.th}>Stattus</th>
          <th style={styles.th}>Área</th>
          <th style={styles.th}>Usuario</th>
          <th style={styles.th}>Ubicación</th>
          <th style={styles.th}>Observaciones</th>
          <th style={styles.th}>Anexo</th>
          <th style={styles.th}>Activo</th>
        </tr>
      </thead>

      <tbody>
        {monitores.map((m) => (
          <tr
            key={m.id_monitor}
            onClick={() => onSelect(m)}
            style={
              selected?.id_monitor === m.id_monitor
                ? styles.selectedRow
                : styles.row
            }
          >
            <td style={styles.td}>{m.serie}</td>
            <td style={styles.td}>{m.marca}</td>
            <td style={styles.td}>{m.modelo}</td>
            <td style={styles.td}>{m.estado_monitor}</td>
            <td style={styles.td}>{m.status_monitor}</td>
            <td style={styles.td}>{m.nombre_area || '-'}</td>
            <td style={styles.td}>{m.usuario || '-'}</td>
            <td style={styles.td}>{m.ubicacion || '-'}</td>
            <td style={styles.td}>{m.observaciones || '-'}</td>
            <td style={styles.td}>{m.anexo || '-'}</td>
            <td style={styles.td}>{m.activo ? 'Sí' : 'No'}</td>
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
    borderSpacing: '0 10px',
    fontSize: '14px',
    color: '#1f2937'
  },

  th: {
    padding: '12px',
    textAlign: 'center',
    fontWeight: '600',
    background: '#b3b8b3ff', // encabezado
    color: '#374151'
  },

  td: {
    padding: '12px',
    textAlign: 'center'
  },

  row: {
    background: '#f4efefff',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },

  
  selectedRow: {
    background: '#afbbeaff', // más oscuro que antes
    cursor: 'pointer',
    fontWeight: '600',
    outline: '2px solid #2563eb'
  }
};

export default MonitoresTable;
