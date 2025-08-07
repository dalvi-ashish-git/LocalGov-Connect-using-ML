import './TopAppBar.css';
import React from 'react';

function TopAppBar({onMenuClick}) {
  return (
    <div className="top-app-bar">
      <div className="start">
        <md-icon-button id="nav-menu" className="menu-button" toggle selected onClick={onMenuClick}>
          <md-icon slot="selected">menu</md-icon>
          <md-icon>menu_open</md-icon>
        </md-icon-button>
        <a href="/">Material Web</a>
      </div>
      <div className="end">
        <md-icon-button>
          <md-icon>search</md-icon>
        </md-icon-button>
        <md-icon-button>
          <md-icon>account_circle</md-icon>
        </md-icon-button>
      </div>
    </div>
  );
}

export default TopAppBar;
