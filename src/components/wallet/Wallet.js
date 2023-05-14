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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Personal Cabinet</h1>
      <div className="flex flex-col md:flex-col mb-2 justify-center space-y-4">
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
      </div>
  
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );

}
export default PersonalCabinet;