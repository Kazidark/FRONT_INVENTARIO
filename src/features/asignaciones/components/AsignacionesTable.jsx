const AsignacionesTable = ({ asignaciones, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Colaborador</th>
          <th style={styles.th}>Área</th>
          <th style={styles.th}>Equipo</th>
          <th style={styles.th}>Fecha inicio</th>
          <th style={styles.th}>Estado</th>
        </tr>
      </thead>

      <tbody>
        {asignaciones.map((a) => (
          <tr
            key={a.id_asignacion}
            onClick={() => onSelect(a)}
            style={{
              ...styles.tr,
              background:
                selected?.id_asignacion === a.id_asignacion
                  ? '#97fa95ff'
                  : '#ffffff'
            }}
          >
            <td style={styles.td}>{a.colaborador}</td>
            <td style={styles.td}>{a.area}</td>
            <td style={styles.td}>
              {a.imei_celular || a.imei_modem || a.numero_chip || '-'}
            </td>
            <td style={styles.td}>
              {new Date(a.fecha_inicio).toLocaleDateString()}
            </td>
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  background: a.activo ? '#dcfce7' : '#fee2e2',
                  color: a.activo ? '#166534' : '#991b1b'
                }}
              >
                {a.activo ? 'Activa' : 'Cerrada'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


/* =========================
   ESTILOS (CLON DE MÓDEMS)
========================= */
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
    background: '#f1f5f9'
  },

  tr: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '10px'
  },

  td: {
    textAlign: 'center',
    padding: '14px',
    color: '#111827',
    background: '#ffffff'
  },

  badge: {
    padding: '5px 12px',
    borderRadius: '999px',
    fontWeight: '600',
    fontSize: '12px'
  },

  empty: {
    textAlign: 'center',
    padding: '30px',
    color: '#6b7280'
  }
};

export default AsignacionesTable;
