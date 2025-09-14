import './TopAppBar.css';
import './theme-settings-menu.js';
import { useRef, useState } from 'react';

function TopAppBar({isDrawerOpen, onMenuClick}) {
  return (
    <div className="top-app-bar">
      <div className="start">
        <md-icon-button id="nav-menu" className="menu-button" toggle selected={!isDrawerOpen}  onClick={onMenuClick}>
          <md-icon slot="selected">menu</md-icon>
          <md-icon>menu_open</md-icon>
        </md-icon-button>
        <md-icon-button href="/" className="home-button">
          <md-icon>local_see</md-icon>
        </md-icon-button>
        <a href="/">LocalGov Connect</a>
      </div>
      <div className="end">
        <md-icon-button>
          <md-icon>search</md-icon>
        </md-icon-button>
        <theme-settings-menu></theme-settings-menu>
      </div>
    </div>
  );
}

export default TopAppBar;
