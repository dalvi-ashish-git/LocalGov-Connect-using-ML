import './BottomAppBar.css';
import tabs from '../utils/navTabs.js';
import { NavLink } from 'react-router-dom';

function BottomAppBar() {
  return (
    <div className="bottom-app-bar">
      <div className="nav-container">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <md-icon>{tab.icon}</md-icon>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default BottomAppBar;
