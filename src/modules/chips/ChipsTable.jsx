const ChipsTable = ({ chips, selected, onSelect }) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {[
            // '#',
            // 'ID',
            'Número',
            'ICCID',
            'Tipo',
            'Operador',
            'Área',
            'Colaborador',
            'Estado Chip',
            'Activo'
          ].map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {chips.map((chip, index) => (
          <tr
            key={chip.id_chip}
            onClick={() => onSelect(chip)}
            style={{
              ...styles.tr,
              background:
                selected?.id_chip === chip.id_chip
                  ? '#afbbeaff'
                  : '#f4efefff'
            }}
          >
            {/* <td style={styles.td}>{index + 1}</td>
            <td style={styles.td}>{chip.id_chip}</td> */}
            <td style={styles.td}>{chip.numero_chip}</td>
            <td style={styles.td}>{chip.iccid}</td>
            
            {/*VOZ / DATOS*/}
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  background:
                    chip.tipo_chip === 'Datos'
                      ? '#e0f2fe'
                      : '#ede9fe',
                  color:
                    chip.tipo_chip === 'Datos'
                      ? '#0369a1'
                      : '#5b21b6'
                }}
              >
                {chip.tipo_chip}
              </span>
            </td>

            <td style={styles.td}>{chip.operador}</td>
            <td style={styles.td}>{chip.area || '-'}</td>
            <td style={styles.td}>{chip.usuario || '-'}</td>

            {/* ESTADO DEL CHIP */}
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  background:
                    chip.estado_chip === 'Activo'
                      ? '#e6f4ea'
                      : '#fdecea',
                  color:
                    chip.estado_chip === 'Activo'
                      ? '#1e7e34'
                      : '#c82333'
                }}
              >
                {chip.estado_chip}
              </span>
            </td>

            {/* ACTIVO / INACTIVO */}
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  background: chip.activo ? '#e0f2fe' : '#f3f4f6',
                  color: chip.activo ? '#0369a1' : '#6b7280'
                }}
              >
                {chip.activo ? 'Si' : 'No'}
              </span>
            </td>
            


           
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* =========================
   ESTILOS — UNIFICADO
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
    fontSize: '12px',
    display: 'inline-block'
  }
};

export default ChipsTable;
