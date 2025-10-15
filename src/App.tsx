import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { InitialAnimation } from './components/InitialAnimation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Programs } from './pages/Programs';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/admin';

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisited');
    if (visited || isAuthPage) {
      setShowAnimation(false);
      setShowContent(true);
      setHasVisited(true);
    }
  }, [isAuthPage]);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setTimeout(() => {
      setShowContent(true);
      setHasVisited(true);
      sessionStorage.setItem('hasVisited', 'true');
    }, 100);
  };

  return (
    <>
      {showAnimation && !hasVisited && !isAuthPage && (
        <InitialAnimation onComplete={handleAnimationComplete} />
      )}

      {(showContent || isAuthPage) && (
        <div className="min-h-screen bg-background animate-in fade-in duration-700">
          {!isAuthPage && !isDashboardPage && <Header />}
          {isDashboardPage && <Header />}

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          {!isAuthPage && !isDashboardPage && <Footer />}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;