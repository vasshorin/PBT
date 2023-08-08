import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreditsCards from './CreditsCards';
import Accounts from './Accounts';
import Categories from './Categories';
import PaymentCalculator from './PaymentCalculator';

const Wallet = () => {
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedRefreshToken && savedUser && savedAccessToken) {
      setRefreshToken(savedRefreshToken);
      setAccessToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
      setIsReady(true);
      // console.log('token', savedRefreshToken);
    }

    if(!savedRefreshToken || !savedUser || !savedAccessToken) {
      navigate('/login');
    }
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    window.location.reload();
    navigate('/login');
  };

  if (!isReady) {
    return (
      <div className="text-3xl font-bold mb-8 text-center pt-20 md:pl-20">Loading...</div>
    );
  }
 
  return (
    <div>
      <div className="text-3xl font-bold mb-8 text-center pt-20 md:pl-20">Manage your accounts</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <Categories refreshToken={refreshToken} user={user} />
        </div>
        <div>
          <Accounts refreshToken={refreshToken} user={user} />
        </div>
        <div>
          <CreditsCards refreshToken={refreshToken} user={user} />
        </div>
        <div>
          <PaymentCalculator />
        </div>
      </div>
    </div>
  );
};

export default Wallet;