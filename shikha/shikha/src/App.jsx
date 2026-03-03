import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import FileReport from './pages/citizen/FileReport';
import TrackReport from './pages/citizen/TrackReport';
import SafetyInfo from './pages/citizen/SafetyInfo';
import AnonymousTip from './pages/citizen/AnonymousTip';
import WantedList from './pages/citizen/WantedList';
import MissingPersons from './pages/citizen/MissingPersons';

// Police Pages
import PoliceDashboard from './pages/police/Dashboard';
import CaseDetails from './pages/police/CaseDetails';
import CriminalRecords from './pages/police/CriminalRecords';
import Officers from './pages/police/Officers';

// Components
import Header from './components/Header';
import FloatingHelpdesk from './components/FloatingHelpdesk';

// Layout Component (Header + Page Content)
const Layout = () => {
  return (
    <>
      <Header />
      <div className="min-vh-100">
        <Outlet />
      </div>
      {/* Global Virtual Assistant */}
      <FloatingHelpdesk />
    </>
  );
};

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />

      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>

        {/* Citizen Routes */}
        <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
          <Route path="/citizen/report" element={<FileReport />} />
          <Route path="/citizen/track" element={<TrackReport />} />
          <Route path="/citizen/safety" element={<SafetyInfo />} />
          <Route path="/citizen/tips" element={<AnonymousTip />} />
          <Route path="/citizen/wanted-list" element={<WantedList />} />
          <Route path="/citizen/missing" element={<MissingPersons />} />
        </Route>

        {/* Police Routes */}
        <Route element={<ProtectedRoute allowedRoles={['police']} />}>
          <Route path="/police/dashboard" element={<PoliceDashboard />} />
          <Route path="/police/case/:id" element={<CaseDetails />} />
          <Route path="/police/records" element={<CriminalRecords />} />
          <Route path="/police/officers" element={<Officers />} />
        </Route>

      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;