import './PageContentPane.css';
import { Outlet } from 'react-router-dom';

function PageContentPane() {
  return (
    <div className="panes">
      <div className="pane">
        <div className="scroll-wrapper">
          <div className="content">
            <main className="page-content">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageContentPane;
