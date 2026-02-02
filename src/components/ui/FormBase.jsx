const FormBase = ({ title, children, onSubmit, loading }) => {
  return (
    <div style={styles.shell}>
      {/* ===== LATERAL ===== */}
      <aside style={styles.side}>
        <h3 style={styles.sideTitle}>{title}</h3>
      </aside>

      {/* ===== FORM ===== */}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.grid}>{children}</div>

        <div style={styles.actions}>
          <button style={styles.submit} disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* =========================
   ESTILOS UNIFICADOS
========================= */
const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    borderRadius: 26,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    background: '#ffffff'
  },

  side: {
    background: 'linear-gradient(180deg,#2563eb,#1e40af)',
    color: '#fff',
    padding: 28
  },

  sideTitle: {
    margin: 0,
    fontWeight: 600
  },

  form: {
    padding: 34,
    display: 'flex',
    flexDirection: 'column',
    gap: 28
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 22
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },

  submit: {
    padding: '14px 40px',
    borderRadius: 999,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default FormBase;
