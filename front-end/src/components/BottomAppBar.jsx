import './BottomAppBar.css';

function BottomAppBar() {
  return (
    <div className="bottom-app-bar">
      <div className="nav-container">
        <md-icon-button>
          <md-icon>home</md-icon>
        </md-icon-button>
        <md-icon-button>
          <md-icon>post_add</md-icon>
        </md-icon-button>
        <md-icon-button>
          <md-icon>update</md-icon>
        </md-icon-button>
        <md-icon-button>
          <md-icon>groups</md-icon>
        </md-icon-button>
      </div>
    </div>
  );
}

export default BottomAppBar;
