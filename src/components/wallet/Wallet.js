import React, { useState, useEffect } from 'react';
import CreditsCards from './CreditsCards';
import Accounts from './Accounts';
import Categories from './Categories';

const PersonalCabinet = () => {
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
      <h1 className="text-3xl font-bold mb-8 text-center pt-20 pl-20">Manage your accounts</h1>
      <div className="container">
        <div>
          <Categories
            refreshToken={refreshToken}
            user={user}
          />
        </div>
        <div>
          <Accounts
            refreshToken={refreshToken}
            user={user}
          />
        </div>
        <div>
          <CreditsCards
            refreshToken={refreshToken}
            user={user}
          />
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
export default PersonalCabinet;