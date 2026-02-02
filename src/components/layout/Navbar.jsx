const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Inventario DR+</h2>

      <div style={styles.menu}>
        <span style={styles.itemActive}>Modems</span>
        <span style={styles.item}>Chips</span>
        <span style={styles.item}>Otros Equipos</span>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: '60px',
    background: '#0d1b2a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 30px',
    justifyContent: 'space-between'
  },
  logo: {
    margin: 0,
    fontSize: '20px'
  },
  menu: {
    display: 'flex',
    gap: '20px'
  },
  item: {
    cursor: 'pointer',
    opacity: 0.7
  },
  itemActive: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderBottom: '2px solid #4cc9f0'
  }
};

export default Navbar;
