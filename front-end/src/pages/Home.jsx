import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import "./Home.css";

function Home() {
  const [citizen, setCitizen] = useState(null);
  const [myIssues, setMyIssues] = useState([]);

  useEffect(() => {
    const fetchCitizen = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("citizens")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) setCitizen(data);
    };

    const fetchIssues = async () => {
      const { data, error } = await supabase
        .from("civic_issues")
        .select("id, title, category, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(3);

      if (!error) setMyIssues(data);
    };

    fetchCitizen();
    fetchIssues();
  }, []);

  return (
    <div className="citizen-home">
      {/* Welcome Header */}
      <section className="welcome-card">
        <div className="welcome-text">
          <h1>Hi {citizen?.full_name || "Citizen"} 👋</h1>
          <p>Ready to make your area better?</p>
          <button className="md-button primary">Report New Issue</button>
        </div>
        {citizen?.profile_photo_url && (
          <img
            src={citizen.profile_photo_url}
            alt="Profile"
            className="profile-photo"
          />
        )}
      </section>

      {/* My Issues */}
      <section className="card-section">
        <h2>My Active Issues</h2>
        <div className="issue-list">
          {myIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-header">
                <span className="issue-title">{issue.title}</span>
                <span className={`status-chip ${issue.status}`}>
                  {issue.status}
                </span>
              </div>
              <p className="issue-category">{issue.category}</p>
              <p className="issue-date">
                Updated {new Date(issue.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <button className="md-button text">View All My Issues →</button>
      </section>

      {/* Community Updates */}
      <section className="card-section">
        <h2>Community Updates</h2>
        <div className="update-list">
          <div className="update-card">
            Water pipeline repair completed in Ward 5.
          </div>
          <div className="update-card">
            Garbage collection time changed in Zone A.
          </div>
        </div>
        <button className="md-button text">See All Updates →</button>
      </section>

      {/* Floating Report Button */}
      <button className="fab">+</button>
    </div>
  );
}

export default Home;
