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

  return (
    <>
      <TopAppBar isDrawerOpen={drawerOpen} onMenuClick={toggleNavigationDrawer} />
      <ModalScrim isDrawerOpen={drawerOpen} onScrimClick={toggleNavigationDrawer} />
      <ModalNavigationDrawer isDrawerOpen={drawerOpen} />
      <PageContentPane />
      <BottomAppBar />
    </>
  );
}

export default App;
