import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/budgetninja.png';

const Navbar = () => {
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});
  const location = useLocation();

  useEffect(() => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (savedRefreshToken && savedUser && savedAccessToken) {
      setRefreshToken(savedRefreshToken);
      setAccessToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    window.location.reload();
    window.location.href = '/login';
  };

  useEffect(() => {
    const mobileMenu = document.getElementById('mobile-menu-2');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    const handleMenuToggle = () => {
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('block');
      }
    };

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', handleMenuToggle);
    }

    return () => {
      if (mobileMenuToggle) {
        mobileMenuToggle.removeEventListener('click', handleMenuToggle);
      }
    };
  }, []);

  return (
    <div>
      <header>
        <nav className="bg-custom-red-color border-gray-200 px-4 lg:px-6 py-2.5 mb-4">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                <img 
                src={logo}
                alt="logo"
                className="w-10 h-10"
                />
              </span>
            </Link>
            <div className="flex items-center lg:order-2">
              <div
                className={`flex items-center ${
                  accessToken ? 'hidden' : ''
                }`}
              >
                <Link
                  to="/login"
                  className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-gray-800 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Register
                </Link>
              </div>
              <div className={`flex items-center ${accessToken ? '' : 'hidden'}`}>
                <button
                  className="text-gray-800 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>

              <button
                id="mobile-menu-toggle"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  className="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <Link
                    to="/"
                    className={`block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 ${
                      location.pathname === '/'
                        ? 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                        : 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                    }`}
                  >
                    Home
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/about"
                    className={`block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 ${
                      location.pathname === '/about'
                        ? 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                        : 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                    }`}
                  >
                    About
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/expenses"
                    className={`block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 ${
                      location.pathname === '/expenses'
                        ? 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                        : 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                    }`}
                  >
                    Expenses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wallet"
                    className={`block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 ${
                      location.pathname === '/wallet'
                        ? 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                        : 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                    }`}
                  >
                    Wallet
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cabinet"
                    className={`block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 ${
                      location.pathname === '/cabinet'
                        ? 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                        : 'lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0'
                    }`}
                  >
                    Cabinet
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

    </div>
  );
};

export default Navbar;