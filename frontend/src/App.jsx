import CitizenLayout from './layouts/CitizenLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Report, Profile, Updates, LandingPage } from './pages/pages.js';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/citizen/login" element={<Login userType="citizen" />} />
        <Route path="/gov/login" element={<Login userType="gov" />} />

        <Route path="/citizen/*" element={<CitizenLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="report/*" element={<Report />} />
          <Route path="updates" element={<Updates />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
