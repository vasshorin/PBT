import React, { useState, useEffect } from 'react';
import CreditsCards from './CreditsCards';
import Accounts from './Accounts';
import Categories from './Categories';
import PaymentCalculator from './PaymentCalculator';

const Wallet = () => {
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});


  useEffect(() => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedRefreshToken && savedUser && savedAccessToken) {
      setRefreshToken(savedRefreshToken);
      setAccessToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
      console.log('token', savedRefreshToken);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    window.location.reload();
    window.location.href = '/login';
  };

  return (
    <div>
<div className="text-3xl font-bold mb-8 text-center pt-20 md:pl-20">Manage your accounts</div>
<div className="flex flex-col md:flex-row justify-center md:justify-start gap-5">
  <div className="flex-1">
    <Categories
      refreshToken={refreshToken}
      user={user}
    />
  </div>
  <div className="flex-1">
    <Accounts
      refreshToken={refreshToken}
      user={user}
    />
  </div>
  <div className="flex-1">
    <CreditsCards
      refreshToken={refreshToken}
      user={user}
    />
  </div>
  <div className="flex-1">
    <PaymentCalculator />
    </div>
</div>
<div className="flex justify-center mt-8">
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    onClick={onLogout}
  >
    Logout
  </button>
</div>

    </div>

  )


}
export default Wallet;