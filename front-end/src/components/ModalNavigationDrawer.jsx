import React from 'react';
import './ModalNavigationDrawer.css';

function ModalNavigationDrawer({isDrawerOpen}) {
  return (
    <div id="nav-drawer" className={`modal-nav-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
      <div className="scroll-wrapper">
        <md-list className="nav-container" role="menubar">
          <md-item><div className="nav-headline">Home</div></md-item>
          <md-list-item href>Dashboard</md-list-item>
          <md-list-item href>Latest Reports</md-list-item>
          <md-list-item href>Notifications</md-list-item>
          <md-divider></md-divider>
          <md-item><div className="nav-headline">Help & Resources</div></md-item>
          <md-list-item href>How to Report</md-list-item>
          <md-list-item href>FAQ's</md-list-item>
          <md-list-item href>Contact Support</md-list-item>
        </md-list>
      </div>
    </div>
  );
}

export default ModalNavigationDrawer;
