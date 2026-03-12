import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Validation from './pages/Validation';
import FraudDetection from './pages/FraudDetection';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Upload from './pages/Upload';
import Export from './pages/Export';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/validation" element={<Validation />} />
        <Route path="/fraud-detection" element={<FraudDetection />} />
        <Route path="/export" element={<Export />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Router>
  );
}

export default App;
