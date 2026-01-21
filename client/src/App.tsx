import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import About from './pages/About';
import Custom from './pages/Custom';
import QuotationPage from './pages/QuotationPage';

// Wrapper to conditionally render Navbar/Footer
const AppContent: React.FC = () => {
    const location = useLocation();
    const isQuotationPage = location.pathname.startsWith('/quotation');

    return (
        <>
            {!isQuotationPage && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/about" element={<About />} />
                <Route path="/custom" element={<Custom />} />
                <Route path="/quotation/:id" element={<QuotationPage />} />
            </Routes>
            {!isQuotationPage && <Footer />}
        </>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
