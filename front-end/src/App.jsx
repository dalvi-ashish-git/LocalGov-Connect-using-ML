import './App.css';
import { useState, useEffect } from 'react';
import TopAppBar from './components/TopAppBar';
import ModalScrim from './components/ModalScrim';
import BottomAppBar from './components/BottomAppBar';
import PageContentPane from './components/PageContentPane';
import ModalNavigationDrawer from './components/ModalNavigationDrawer';

function App() {
  useEffect(() => {
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-surface-container').trim();
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if(metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
    else {
      const metaTag = document.createElement('meta');
      metaTag.name = 'theme-color';
      metaTag.content = themeColor;
      document.head.appendChild(metaTag);
    }
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleNavigationDrawer = () => {
    setDrawerOpen((prev) => !(prev));
  };

 /* const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { name: 'Home', icon: '🏠' },
    { name: 'Discover', icon: '🔍' },
    { name: 'Post', icon: '➕' },
    { name: 'Notifications', icon: '🔔' },
    { name: 'Profile', icon: '👤' }
  ];*/

  return (
   <>
    <TopAppBar isDrawerOpen={drawerOpen} onMenuClick={toggleNavigationDrawer} />
    <ModalScrim isDrawerOpen={drawerOpen} onScrimClick={toggleNavigationDrawer} />
    <ModalNavigationDrawer isDrawerOpen={drawerOpen} />
    <PageContentPane />
    <BottomAppBar />
   {/* <div className="app-container">
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
    </div>*/}
    </>
  );
}

export default App;
