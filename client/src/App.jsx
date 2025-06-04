import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Registration from './pages/Registration';
import AdvancedSearch from './pages/AdvancedSearch';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/search" element={<AdvancedSearch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;