export default function StatCard({ icon: Icon, label, value, sub }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={22}/></div><small>{label}</small><h3>{value}</h3><p>{sub}</p></div>
}
