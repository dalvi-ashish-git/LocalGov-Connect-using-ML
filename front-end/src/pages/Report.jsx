import './Report.css';
//import ReportForm from './ReportForm';

function Report() {
  return (
  <>
  {/*<ReportForm />
 */}   <div className="report-list-container">
      <md-fab label="Report Issue" variant="primary">
        <md-icon slot="icon">add</md-icon>
      </md-fab>
      <div className="empty-list-state">
        <div className="empty-state-header">
          <md-icon class="empty-state-icon">report</md-icon>
          <h2>No Reports Yet</h2>
        </div>
        <p>You haven’t reported any issues so far.</p>
      </div>
      <md-list>
        <h3>Your Reported Issues</h3>
{Array.from({ length: 20 }).map((_, index) => (
        <md-list-item type="button" selected>
          <md-icon slot="start">image</md-icon>
          <div slot="overline">Overline</div>
          <div slot="headline">Headline</div>
          <div slot="supporting-text">Supporting text</div>
          <div slot="trailing-supporting-text">Trailing</div>
          <md-icon slot="end">image</md-icon>
        </md-list-item>
))}
      </md-list>
    </div>
    </>
  );
}

export default Report;
