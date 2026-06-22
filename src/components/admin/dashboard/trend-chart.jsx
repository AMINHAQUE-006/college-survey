function TrendChart() {
  const points = "15,145 85,126 155,134 225,91 295,102 365,62 435,34";
  return (
    <div className="trend">
      <div className="ylabels">
        <span>600</span>
        <span>450</span>
        <span>300</span>
        <span>150</span>
        <span>0</span>
      </div>
      <svg viewBox="0 0 450 170" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 60, 95, 130, 165].map((y) => (
          <line key={y} x1="0" x2="450" y1={y} y2={y} className="gridline" />
        ))}
        <polygon points={`${points} 435,165 15,165`} fill="url(#fade)" />
        <polyline points={points} className="trendline" />
        {points.split(" ").map((p, i) => {
          const [x, y] = p.split(",");
          return <circle key={i} cx={x} cy={y} r="4" />;
        })}
      </svg>
      <div className="xlabels">
        {["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
    </div>
  );
}

export default TrendChart;
