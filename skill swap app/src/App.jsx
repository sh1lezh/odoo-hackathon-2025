import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { RequestProvider } from './contexts/RequestContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import SwapRequests from './pages/SwapRequests';
import SwapRequestFlow from './pages/SwapRequestFlow';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <RequestProvider>
            <div className="min-h-screen bg-gray-900">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/requests" element={<SwapRequests />} />
                  <Route path="/request/:userId" element={<SwapRequestFlow />} />
                </Routes>
              </main>
            </div>
          </RequestProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 