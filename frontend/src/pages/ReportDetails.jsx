import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
import "./ReportDetails.css";

function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchReport();
    fetchComments();
    fetchVotes();
  }, [id]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from("civic_issues")
        .select(`
          *,
          official:gov_officials!civic_issues_gov_official_id_fkey (full_name, designation)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      setReport(data);
    } catch (error) {
      setError(error?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("issue_comments")
        .select("*, citizen:citizen_id (full_name)")
        .eq("issue_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase
        .from("issue_votes")
        .select("vote_type")
        .eq("issue_id", id);
      if (error) throw error;
      let upvotes = 0, downvotes = 0;
      (data || []).forEach(v => {
        if (v.vote_type === "upvote") upvotes++;
        if (v.vote_type === "downvote") downvotes++;
      });
      setVotes({ upvotes, downvotes });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this report permanently?")) return;
    try {
      const { error } = await supabase.from("civic_issues").delete().eq("id", id);
      if (error) throw error;
      navigate("/citizen/report");
    } catch (error) {
      alert("Failed to delete report: " + (error?.message || error));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentUser) {
      alert("Please sign in to post comments");
      return;
    }
    setCommentLoading(true);
    try {
      const { error } = await supabase.from("issue_comments").insert([{
        issue_id: id,
        content: commentText.trim(),
        citizen_id: currentUser.id,
      }]);
      if (error) throw error;
      setCommentText("");
      fetchComments();
    } catch (error) {
      alert("Failed to post comment: " + (error?.message || error));
    }
    setCommentLoading(false);
  };

  const handleVote = async (type) => {
    if (!currentUser) {
      alert("Please sign in to vote");
      return;
    }
    setVoteLoading(true);
    try {
      const { data: existingVote, error: fetchError } = await supabase
        .from("issue_votes")
        .select("*")
        .eq("issue_id", id)
        .eq("citizen_id", currentUser.id)
        .single();
      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (existingVote) {
        const { error } = await supabase
          .from("issue_votes")
          .update({ vote_type: type })
          .eq("id", existingVote.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("issue_votes").insert([{
          issue_id: id,
          citizen_id: currentUser.id,
          vote_type: type,
        }]);
        if (error) throw error;
      }
      fetchVotes();
    } catch (error) {
      alert("Failed to vote: " + (error?.message || error));
    }
    setVoteLoading(false);
  };

  if (loading) {
    return (
      <div className="report-details-loading">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-details-error">
        <h2>Report not found</h2>
        {error && <p>{error}</p>}
        <md-text-button onClick={() => navigate(-1)}>
          <md-icon slot="icon">arrow_back</md-icon> Back
        </md-text-button>
      </div>
    );
  }

  return (
    <div className="report-details-container">
      <md-text-button className="back-btn" onClick={() => navigate(-1)}>
        <md-icon slot="icon">arrow_back</md-icon> Back
      </md-text-button>

      <div className="report-details-card">
        <header className="report-header">
          <div>
            <h2>{report.title}</h2>
            <span className={`status-badge status-${report.status.toLowerCase()}`}>
              {report.status}
            </span>
          </div>
          <md-icon className="map-icon">map</md-icon>
        </header>

        <section className="report-info">
          <div><strong>Reported on:</strong> {new Date(report.created_at).toLocaleDateString()}</div>
          <div><strong>Category:</strong> {report.category}</div>
          <div><strong>Severity:</strong> {report.severity}</div>
          {report.official && (
            <div><strong>Assigned to:</strong> {report.official.full_name} ({report.official.designation})</div>
          )}
        </section>

        {report.image_urls?.length > 0 && (
          <section className="report-images">
            {report.image_urls.map((url, idx) => (
              <img key={idx} src={url} alt={`Issue ${idx + 1}`} />
            ))}
          </section>
        )}

        <section className="report-description">
          <h3>Description</h3>
          <p>{report.description}</p>
        </section>

        <section className="vote-section">
          <h3>Support this Report</h3>
          <div className="vote-row">
            <md-filled-tonal-button disabled={voteLoading} onClick={() => handleVote("upvote")}>
              <md-icon slot="icon">thumb_up</md-icon> Upvote ({votes.upvotes})
            </md-filled-tonal-button>
            <md-filled-tonal-button disabled={voteLoading} onClick={() => handleVote("downvote")}>
              <md-icon slot="icon">thumb_down</md-icon> Downvote ({votes.downvotes})
            </md-filled-tonal-button>
          </div>
        </section>

        <section className="comments-section">
          <details>
            <summary>
              <md-text-button>
                <md-icon slot="icon">chat</md-icon> View Comments ({comments.length})
              </md-text-button>
            </summary>
            <div className="comment-container">
              {comments.length === 0 ? (
                <p className="empty-comment">No comments yet.</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <strong>{c.citizen?.full_name || "Anonymous"}</strong>
                    <p>{c.content}</p>
                    <span className="comment-time">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </details>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <md-outlined-text-field
              label="Add a comment"
              value={commentText}
              onInput={(e) => setCommentText(e.target.value)}
              disabled={commentLoading}
              style={{ width: "100%" }}
            ></md-outlined-text-field>
            <md-filled-button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
            >
              <md-icon slot="icon">send</md-icon> Post
            </md-filled-button>
          </form>
        </section>

        <section className="actions">
          <md-text-button onClick={handleDelete} className="delete-btn">
            <md-icon slot="icon">delete</md-icon> Delete Report
          </md-text-button>
        </section>
      </div>
    </div>
  );
}

export default ReportDetails;
