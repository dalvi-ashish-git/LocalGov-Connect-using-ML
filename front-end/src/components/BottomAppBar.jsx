import './BottomAppBar.css';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/report', icon: 'post_add', label: 'Report' },
  { to: '/updates', icon: 'update', label: 'Updates' },
  { to: '/community', icon: 'groups', label: 'Community' },
];

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
