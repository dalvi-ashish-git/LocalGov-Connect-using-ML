import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TopAppBar, ModalScrim, BottomAppBar, PageContentPane, SideNavigationRail, ModalNavigationDrawer } from '../components/components.js';

function CitizenLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleNavigationDrawer = () => {
    setDrawerOpen((prev) => !(prev));
  };

  return (
    <>
      <TopAppBar isDrawerOpen={drawerOpen} onMenuClick={toggleNavigationDrawer} />
      <SideNavigationRail isDrawerOpen={drawerOpen} onMenuClick={toggleNavigationDrawer} />
      <ModalScrim isDrawerOpen={drawerOpen} onScrimClick={toggleNavigationDrawer} />
      <ModalNavigationDrawer isDrawerOpen={drawerOpen} />
      <PageContentPane>
        <Outlet />
      </PageContentPane>
      <BottomAppBar />
    </>
  );
}

export default CitizenLayout;
