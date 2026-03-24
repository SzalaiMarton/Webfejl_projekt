import "../styles/tokens.css"
import "../styles/global.css"
import "../styles/layout.css"

function DashboardPage() {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome to your Issue Tracker dashboard!</p>
      <div className="grid">
        <div className="card">
          <h3>Recent Issues</h3>
          <p>No recent issues to display.</p>
        </div>
        <div className="card">
          <h3>Projects</h3>
          <p>No projects to display.</p>
        </div>
        <div className="card">
          <h3>Statistics</h3>
          <p>Statistics will be shown here.</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
