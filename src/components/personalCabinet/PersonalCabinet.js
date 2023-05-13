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
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Personal Cabinet</h1>
        <Categories 
          refreshToken={refreshToken}
          user={user}
        />
        <Accounts 
          refreshToken={refreshToken}
          user={user}
        />
        <CreditsCards 
          refreshToken={refreshToken}
          user={user}
        />
       {/* Add logout */}
       <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={(onLogout) => {
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          window.location.reload();
          window.location.href = '/login';
        }}
      >
        Logout
      </button>
    </div>

  );
};

export default PersonalCabinet;