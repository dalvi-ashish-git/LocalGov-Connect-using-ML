import { useState, useEffect } from 'react';
import supabase from './utils/supabaseClient';
import { Routes, Route } from 'react-router-dom';

// Import reusable components
import TopAppBar from './components/TopAppBar';
import ModalScrim from './components/ModalScrim';
import BottomAppBar from './components/BottomAppBar';
import PageContentPane from './components/PageContentPane';
import SideNavigationRail from './components/SideNavigationRail';
import ModalNavigationDrawer from './components/ModalNavigationDrawer';

// Import navigation pages 
import Home from './pages/Home';
import Login from './pages/Login';
import Report from './pages/Report';
import Profile from './pages/Profile';
import Updates from './pages/Updates';
import Community from './pages/Community';

import { handleCitizen } from './services/citizenManager.js';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && session.user) {
        handleCitizen();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && session.user) {
        handleCitizen();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleNavigationDrawer = () => {
    setDrawerOpen((prev) => !(prev));
  };

  if (!session) {
    return <Login />;
  }

  return (
    <>
      <TopAppBar isDrawerOpen={drawerOpen} onMenuClick={toggleNavigationDrawer} />
      <SideNavigationRail isDrawerOpen={drawerOpen} onMenuClick={toggleNavigationDrawer} />
      <ModalScrim isDrawerOpen={drawerOpen} onScrimClick={toggleNavigationDrawer} />
      <ModalNavigationDrawer isDrawerOpen={drawerOpen} />
      <Routes>
        <Route element={<PageContentPane />}>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <BottomAppBar />
    </>
  );
}

export default App;
