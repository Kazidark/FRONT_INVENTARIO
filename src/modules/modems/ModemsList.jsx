import { updateModem } from '../../api/modems.api';
import React from 'react';

const ModemsList = ({ modems, onEdit, onToggle }) => {

  const toggleActivo = async (modem) => {
    const nuevoEstado =
      modem.estado_modem === 'Operativo' ? 'Inoperativo' : 'Operativo';

    await updateModem(modem.id_modem, {
      ...modem,
      estado_modem: nuevoEstado
    });

    onToggle();
  };

  return (
    <div>
      <h3 style={{ marginBottom: '15px' }}>Listado de Modems</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>IMEI</th>
            <th>Área</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modems.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No hay modems registrados
              </td>
            </tr>
          ) : (
            modems.map((m) => (
              <tr key={m.id_modem}>
                <td>{m.marca}</td>
                <td>{m.modelo}</td>
                <td>{m.imei_modem}</td>
                <td>{m.nombre_area || '-'}</td>
                <td>
                  <span
                    style={{
                      ...styles.badge,
                      background: m.activo ? '#e6f4ea' : '#fdecea',
                      color: m.activo ? '#1e7e34' : '#c82333'
                    }}
                  >
                    {m.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button style={styles.btnEdit} onClick={() => onEdit(m)}>
                    ✏️ Editar
                  </button>
                  <button
                    style={m.activo ? styles.btnDanger : styles.btnSuccess}
                    onClick={() => toggleActivo(m)}
                  >
                    {m.activo ? '⛔ Desactivar' : '✅ Reactivar'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  btnEdit: {
    marginRight: '8px',
    padding: '6px 10px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnDanger: {
    padding: '6px 10px',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnSuccess: {
    padding: '6px 10px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ModemsList;
