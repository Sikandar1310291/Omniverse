import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import APIKeys from './pages/APIKeys';
import Agent from './pages/Agent';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white/20">
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/apikeys" element={<APIKeys />} />
          </Route>
          <Route path="/agent" element={<Agent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
