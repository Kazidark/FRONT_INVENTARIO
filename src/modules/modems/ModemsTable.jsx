const ModemsTable = ({ modems, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {[
            'Marca',
            'Modelo',
            'IMEI',
            'Estado Módem',
            'Estado Equipo',
            'Área',
            'Usuario',
            'Chip',
            'Activo'
          ].map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {modems.length === 0 ? (
          <tr>
            <td colSpan="9" style={styles.empty}>
              No hay módems registrados
            </td>
          </tr>
        ) : (
          modems.map(m => (
            <tr
              key={m.id_modem}
              onClick={() => onSelect(m)}
              style={{
                ...styles.tr,
                background:
                  selected?.id_modem === m.id_modem
                    ? '#afbbeaff'
                    : '#f4efefff'
              }}
            >
              <td style={styles.td}>{m.marca}</td>
              <td style={styles.td}>{m.modelo}</td>
              <td style={styles.td}>{m.imei_modem}</td>
              <td style={styles.td}>{m.estado_modem}</td>
              <td style={styles.td}>{m.estado_equipo}</td>
              <td style={styles.td}>{m.nombre_area || '-'}</td>
              <td style={styles.td}>{m.usuario || '-'}</td>

              {/* ===== CHIP ===== */}
              <td style={styles.td}>
                {m.numero_chip
                  ? `${m.numero_chip}`
                  : ''}
              </td>

              {/* ===== ACTIVO ===== */}
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    background: m.activo ? '#e6f4ea' : '#fdecea',
                    color: m.activo ? '#1e7e34' : '#c82333'
                  }}
                >
                  {m.activo ? 'Si' : 'No'}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

/* =========================
   ESTILOS (SIN CAMBIOS)
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
    background: '#b3b8b3ff'
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
    color: '#111827'
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

export default ModemsTable;
