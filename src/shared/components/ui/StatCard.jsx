const StatCard = ({ label, value, icon = 'pi-chart-bar', tone = 'success' }) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body d-flex align-items-center gap-3 py-3">
        <div
          className={`rounded-3 d-inline-flex align-items-center justify-content-center bg-${tone}-subtle text-${tone}`}
          style={{ width: 44, height: 44 }}
          aria-hidden="true"
        >
          <i className={`pi ${icon}`} />
        </div>

        <div className="flex-grow-1">
          <div className="text-secondary small fw-semibold text-uppercase" style={{ letterSpacing: 0.4 }}>
            {label}
          </div>
          <div className="fs-3 fw-bold lh-1">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
