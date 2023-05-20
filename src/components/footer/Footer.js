import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import About from '../about/About';

const Footer = () => {
  return (
    <>
<footer class="bottom-0 pt-10 left-0 z-20 w-full border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600 pb-30 mt-20">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" class="hover:underline">Personal Budget Tracker</a>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <Link to="/about" class="mr-4 hover:underline md:mr-6">About</Link>
        </li>
        <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
        </li>
        <li>
            <a href="#" class="hover:underline">Contact</a>
        </li>
    </ul>
</footer>

<Routes>
        {/* <Route path="/main" element={<Main />} /> */}
        <Route path="/about" element={<About />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/expenses" element={<Expenses />} /> */}
        {/* <Route path="/wallet" element={<Wallet />} /> */}
        {/* <Route path='/cabinet' element={<Cabinet />} /> */}
      </Routes>
</>
  )
}

export default Footer