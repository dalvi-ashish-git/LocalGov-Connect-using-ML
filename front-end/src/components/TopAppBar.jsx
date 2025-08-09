import './TopAppBar.css';

function TopAppBar({isDrawerOpen, onMenuClick}) {
  return (
    <div className="top-app-bar">
      <div className="start">
        <md-icon-button id="nav-menu" className="menu-button" toggle selected={!isDrawerOpen ? true : false}  onClick={onMenuClick}>
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
        <md-icon-button>
          <md-icon>account_circle</md-icon>
        </md-icon-button>
      </div>
    </div>
  );
}

export default TopAppBar;
