import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';
import './ReportList.css';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('civic_issues')
        .select(`
          *,
          citizen:citizens!civic_issues_citizen_id_fkey (
            full_name,
            profile_photo_url
          ),
          official:gov_officials!civic_issues_gov_official_id_fkey (
            full_name,
            designation
          )
        `)
        .eq('citizen_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data ?? []);
    } catch (error) {
      console.error('Error fetching reports:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = () => navigate('/citizen/report/form');

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'circle';
    }
  };

  if (loading) {
    return (
      <div className="report-list-container">
        <div className="loading-state">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>
      </div>
    );
  }

  return (
    <div className="report-list-container">
      <md-fab 
        label="Report Issue" 
        variant="primary"
        onClick={handleReportIssue}
      >
        <md-icon slot="icon">add</md-icon>
      </md-fab>
      
      {reports.length === 0 ? (
        <div className="empty-list-state">
          <div className="empty-state-header">
            <md-icon className="empty-state-icon">report</md-icon>
            <h2>No Reports Yet</h2>
          </div>
          <p>You haven't reported any issues so far.</p>
        </div>
      ) : (
        <md-list>
          <h3>Your Reported Issues</h3>
          {reports.map((report) => (
            <md-list-item 
              key={report.id}
              type="button"
              onClick={() => navigate(`${report.id}`)}
            >
              {report.image_urls?.length > 0 ? (
                <img 
                  slot="start" 
                  src={report.image_urls[0]} 
                  alt=""
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--webpage-shape-s)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <md-icon slot="start">description</md-icon>
              )}
              <div slot="overline">
                {report.category} • {new Date(report.created_at).toLocaleDateString()}
              </div>
              <div slot="headline">
                <md-icon 
                  class={`severity-icon severity-${report.severity?.toLowerCase()}`}
                >
                  {getSeverityIcon(report.severity)}
                </md-icon>
                {report.title}
              </div>
              <div slot="supporting-text">
                {report.description.length > 100 
                  ? `${report.description.substring(0, 100)}...` 
                  : report.description}
              </div>
              <div slot="trailing-supporting-text">
                <span className={`status-badge ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
                {report.upvotes > 0 && (
                  <span className="vote-count upvotes">
                    <md-icon>thumb_up</md-icon>
                    {report.upvotes}
                  </span>
                )}
              </div>
              <md-icon slot="end">chevron_right</md-icon>
            </md-list-item>
          ))}
        </md-list>
      )}
    </div>
  );
}

export default ReportList;
