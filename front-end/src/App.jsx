import './App.css';
import { useState } from 'react';
import TopAppBar from './components/TopAppBar';
import ModalNavigationDrawer from './components/ModalNavigationDrawer';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleNavigationDrawer = () => {
    setDrawerOpen((prev) => !(prev));
  };

  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { name: 'Home', icon: '🏠' },
    { name: 'Discover', icon: '🔍' },
    { name: 'Post', icon: '➕' },
    { name: 'Notifications', icon: '🔔' },
    { name: 'Profile', icon: '👤' }
  ];

  return (
   <>
    <TopAppBar onMenuClick={toggleNavigationDrawer} />
    <ModalNavigationDrawer isOpen={drawerOpen} />
    <div className="app-container">
      <div className="screen-content">
        <h1>{activeTab}</h1>
        <p>This is the <strong>{activeTab}</strong> screen.</p>
      </div>

      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`nav-button ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            <span className="icon">{tab.icon}</span>
            <span className="label">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
    </>
  );
}

export default App;
