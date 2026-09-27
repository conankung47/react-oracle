const STATS = [
  { label: "เส้นทางให้บริการ", value: "3 เส้นทาง" },
  { label: "รอบเดินรถต่อวัน", value: "4 รอบ/เส้นทาง" },
  { label: "จุดจอดรับส่ง", value: "7 จุด" },
];

function SystemStats() {
  return (
    <div className="system-stats">
      {STATS.map((stat) => (
        <div className="stat-row" key={stat.label}>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

export default SystemStats;