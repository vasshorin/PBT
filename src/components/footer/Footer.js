import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from '../about/About';
import PrivacyPolicy from '../policy/PrivacyPolicy';
import LicensingPage from '../licensing/LincensingPage';
import ContactPage from '../contact/Contact';

const Footer = () => {
  return (
 
<footer class="bg-white rounded-lg shadow m-4">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center">© 2023 <a href="https://flowbite.com/" class="hover:underline">PBT</a>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
        <li>
            <Link to="/about" class="mr-4 hover:underline md:mr-6 ">About</Link>
        </li>
        <li>
            <Link to="/privacy" class="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
        </li>
        <li>
            <Link to="/licensing" class="mr-4 hover:underline md:mr-6">Licensing</Link>
        </li>
        <li>
            <Link to="/contact" class="hover:underline">Contact</Link>
        </li>
    </ul>
    </div>
</footer>

  );
};

export default Footer;
