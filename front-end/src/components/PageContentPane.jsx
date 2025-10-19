import './PageContentPane.css';
import { Outlet } from 'react-router-dom';

function PageContentPane() {
  return (
    <div className="panes">
      <div className="pane content-pane">
        <div className="scroll-wrapper">
          <div className="content">
            <main>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageContentPane;
