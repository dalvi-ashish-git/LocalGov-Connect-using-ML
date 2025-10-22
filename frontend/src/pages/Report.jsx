import './Report.css';
import ReportForm from './ReportForm';
import ReportList from './ReportList';
import ReportDetails from './ReportDetails';
import { Routes, Route } from 'react-router-dom';

function Report() {
  return (
    <Routes>
      <Route path="" element={<ReportList />} />
      <Route path="form" element={<ReportForm />} />
      <Route path=":id" element={<ReportDetails />} />
    </Routes>
  );
}

export default Report;
