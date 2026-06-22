import { Icon } from "@/constant";

const Stat = ({ icon, label, value, delta, tone }) => (
  <article className="stat-card">
    <div className={`stat-icon ${tone}`}>
      <Icon name={icon} />
    </div>
    <div>
      <p>{label}</p>
      <h3>{value}</h3>
      <small>
        <b>↗ {delta}</b> vs last month
      </small>
    </div>
  </article>
);

export default Stat;
