import './TopAppBar.css';
import './SideNavigationRail.css';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/report', icon: 'post_add', label: 'Report' },
  { to: '/updates', icon: 'update', label: 'Updates' },
  { to: '/community', icon: 'groups', label: 'Community' },
];

function SideNavigationRail({isDrawerOpen, onMenuClick}) {
  return (
    <div className="side-nav-rail"> 
      <div className="nav-container">
        <md-icon-button id="nav-menu" className="menu-button" toggle selected={!isDrawerOpen}  onClick={onMenuClick}>
          <md-icon slot="selected">menu</md-icon>
          <md-icon>menu_open</md-icon>
        </md-icon-button>
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

export default SideNavigationRail;
