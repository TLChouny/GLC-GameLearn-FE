import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import HomePage from './pages/HomePage';
import LuckyWheelPage from './pages/LuckyWheelPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/users/UsersPage';
import GamesPage from './pages/admin/games/GamesPage';
import ItemsPage from './pages/admin/items/ItemsPage';
import RankingsPage from './pages/admin/rankings/RankingsPage';
import LuckyWheelsPage from './pages/admin/lucky-wheels/LuckyWheelsPage';
import SubjectsPage from './pages/admin/subjects/SubjectsPage';
import CertificatesPage from './pages/admin/certificates/CertificatesPage';
import TradesPage from './pages/admin/trades/TradesPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            {/* Home route - always show HomePage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Lucky Wheel route */}
            <Route path="/lucky-wheel" element={<LuckyWheelPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/games" element={<GamesPage />} />
            <Route path="/admin/items" element={<ItemsPage />} />
            <Route path="/admin/rankings" element={<RankingsPage />} />
            <Route path="/admin/lucky-wheels" element={<LuckyWheelsPage />} />
            <Route path="/admin/subjects" element={<SubjectsPage />} />
            <Route path="/admin/certificates" element={<CertificatesPage />} />
            <Route path="/admin/trades" element={<TradesPage />} />
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
