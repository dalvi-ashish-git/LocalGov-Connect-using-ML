import './Home.css';
import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = "John Doe"; // Placeholder until user data integration

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('civic_issues')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching issues:', error.message);
    } else {
      setIssues(data);
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <div className="greeting-card">
        <h1>Welcome, {userName}!</h1>
        <p>We're glad you're here. See what's happening in your community and contribute to making it better.</p>
      </div>

      <div className="section">
        <h2>Recent Civic Issues</h2>
        {loading ? (
          <p>Loading issues...</p>
        ) : issues.length === 0 ? (
          <p>No issues reported yet.</p>
        ) : (
          <div className="issues-list">
            {issues.map((issue) => (
              <div key={issue.id} className="issue-card">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
