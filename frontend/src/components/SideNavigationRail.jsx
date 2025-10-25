import './TopAppBar.css';
import './SideNavigationRail.css';
import tabs from '../utils/navTabs.js';
import { NavLink } from 'react-router-dom';

function SideNavigationRail({isDrawerOpen, onMenuClick}) {
  return (
    <div className="side-nav-rail"> 
      <div className="nav-container">
        <md-icon-button
          id="nav-menu"
          title={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-label="Close navigation menu"
          aria-label-selected="Open navigation menu"
          className="menu-button"
          toggle
          selected={!isDrawerOpen}
          onClick={onMenuClick}>
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
