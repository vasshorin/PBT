import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from '../about/About';
import PrivacyPolicy from '../policy/PrivacyPolicy';
import LicensingPage from '../licensing/LincensingPage';
import ContactPage from '../contact/Contact';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full bg-gray-100 border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
      <div className="container mx-auto py-3 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2023 <a href="#" className="hover:underline">Personal Budget Tracker</a>. All Rights Reserved.
      </div>
      <ul className="flex flex-wrap items-center justify-center mt-3 space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        <li>
          <Link to="/about" className="hover:underline">About</Link>
        </li>
        <li>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/licensing" className="hover:underline">Licensing</Link>
        </li>
        <li>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </li>
      </ul>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/licensing" element={<LicensingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </footer>
  );
};

export default Footer;
