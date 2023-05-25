import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Main from './components/main/Main';
import Footer from './components/footer/Footer';
import About from './components/about/About';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Expenses from './components/expenses/Expenses';
import Wallet from './components/wallet/Wallet';
import Cabinet from './components/cabinet/Cabinet';
import PrivacyPolicy from './components/policy/PrivacyPolicy';
import LicensingPage from './components/licensing/LincensingPage';
import ContactPage from './components/contact/Contact';


function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/cabinet" element={<Cabinet />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/licensing" element={<LicensingPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;
