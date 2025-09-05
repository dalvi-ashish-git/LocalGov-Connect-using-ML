import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import reusable components
import TopAppBar from './components/TopAppBar';
import ModalScrim from './components/ModalScrim';
import BottomAppBar from './components/BottomAppBar';
import PageContentPane from './components/PageContentPane';
import ModalNavigationDrawer from './components/ModalNavigationDrawer';

// Import navigation pages 
import Home from './pages/Home';
import Report from './pages/Report';
import Updates from './pages/Updates';
import Community from './pages/Community';

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
      <Routes>
        <Route element={<PageContentPane />}>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/community" element={<Community />} />
        </Route>
      </Routes>
      <BottomAppBar />
    </>
  );
}

export default App;
