const TabletsTable = ({ tablets, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {[
            'Marca',
            'Modelo',
            'IMEI',
            'Chip',              // ✅ COLUMNA CHIP (FALTANTE)
            'Estado Tablet',
            'Estado Equipo',
            'Área',
            'Usuario',
            'Ubicación',
            'Observaciones',
            'Activo'
          ].map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {tablets.map(t => (
          <tr
            key={t.id_tablet}
            onClick={() => onSelect(t)}
            style={{
              ...styles.tr,
              background:
                selected?.id_tablet === t.id_tablet
                  ? '#afbbeaff'
                  : '#f4efefff'
            }}
          >
            <td style={styles.td}>{t.marca}</td>
            <td style={styles.td}>{t.modelo}</td>
            <td style={styles.td}>{t.imei_tablet}</td>

            {/* ✅ CHIP ASOCIADO (MISMA LÓGICA QUE CELULARES) */}
            <td style={styles.td}>
              {t.numero_chip
                ? `${t.numero_chip}`
                : ''}
            </td>

            <td style={styles.td}>{t.estado_tablet}</td>
            <td style={styles.td}>{t.estado_equipo}</td>
            <td style={styles.td}>{t.nombre_area || '-'}</td>
            <td style={styles.td}>{t.usuario || '-'}</td>
            <td style={styles.td}>{t.ubicacion || '-'}</td>
            <td style={styles.td}>{t.observaciones || '-'}</td>
            <td style={styles.td}>{t.activo ? 'Sí' : 'No'}</td>
          </tr>
        ))}
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
    borderSpacing: '0 8px'
  },
  th: {
    textAlign: 'center',
    padding: 12,
    background: '#b3b8b3ff'
  },
  tr: {
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,.05)'
  },
  td: {
    textAlign: 'center',
    padding: 14
  }
};

export default TabletsTable;
