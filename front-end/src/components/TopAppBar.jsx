import './TopAppBar.css';
import { useRef, useState } from 'react';

function TopAppBar({isDrawerOpen, onMenuClick}) {
  const themeAnchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <md-icon-button
          ref={themeAnchorRef}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <md-icon>palette</md-icon>
        </md-icon-button>

        <md-menu
          open={menuOpen}
          anchor={themeAnchorRef.current}
          onClose={() => setMenuOpen(false)}
        >
        <md-menu-item>
      <div slot="headline">Apple</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Banana</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Cucumber</div>
    </md-menu-item>
        </md-menu>

      </div>
    </div>
  );
}

export default TopAppBar;
