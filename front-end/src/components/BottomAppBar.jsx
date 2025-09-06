import './BottomAppBar.css';
import { NavLink } from 'react-router-dom';

function BottomAppBar() {
  return (
    <div className="bottom-app-bar">
      <div className="nav-container">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <md-icon>home</md-icon>
          <span>Home</span>
        </NavLink>
        <NavLink to="/report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <md-icon>post_add</md-icon>
          <span>Report</span>
        </NavLink>
        <NavLink to="/updates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <md-icon>update</md-icon>
          <span>Updates</span>
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <md-icon>groups</md-icon>
          <span>Community</span>
        </NavLink>
      </div>
    </div>
  );
}

export default BottomAppBar;
