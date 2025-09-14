import './Updates.css';
import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

function Updates() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = "John Doe"; // Placeholder name for the logged-in citizen

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('civic_issues')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5); // Get latest 5 issues

    if (error) {
      console.error('Error fetching issues:', error.message);
    } else {
      setIssues(data);
    }
    setLoading(false);
  };

  return (
    <div className="updates-container">
      <div className="updates-header">
        <h1>Community Updates</h1>
        <p>Welcome back, {userName}! Stay informed and help improve our neighborhood.</p>
      </div>

      <div className="section">
        <h2>Latest Reports</h2>
        {loading ? (
          <p>Loading updates...</p>
        ) : issues.length === 0 ? (
          <p>No issues reported yet.</p>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="update-card">
              <h3>{issue.title}</h3>
              <p><strong>Category:</strong> {issue.category}</p>
              <p><strong>Status:</strong> {issue.status}</p>
              <p>{issue.description}</p>
              {issue.image_urls.length > 0 && (
                <div className="images-container">
                  {issue.image_urls.map((url, index) => (
                    <img key={index} src={url} alt={`Issue image ${index + 1}`} />
                  ))}
                </div>
              )}
              <p className="timestamp">Reported on {new Date(issue.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h2>Announcements</h2>
        <div className="announcement-card">
          <p>Water supply maintenance is scheduled on 15th Sep 2025 from 8 AM to 2 PM. Please plan accordingly.</p>
        </div>
      </div>

      <div className="section">
        <h2>Your Reports</h2>
        <div className="announcement-card">
          <p>View and manage your submitted reports (coming soon).</p>
        </div>
      </div>

      <div className="section">
        <h2>Helpful Resources</h2>
        <div className="resource-cards">
          <div className="resource-card">Waste Collection Schedule</div>
          <div className="resource-card">Emergency Contacts</div>
          <div className="resource-card">How to Report an Issue</div>
        </div>
      </div>
    </div>
  );
}

export default Updates;
