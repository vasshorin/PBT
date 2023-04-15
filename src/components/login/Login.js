import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'


function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [user, setUser] = useState({})
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const onClickHandle = async (e) => {
    e.preventDefault()
    const res = await axios.post('http://localhost:5050/login',
      {
        username: username,
        password: password
      })
      localStorage.setItem('refreshToken', res.headers["auth-token-refresh"]);
      localStorage.setItem('accessToken', res.headers["auth-token-access"]);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setAccessToken(res.headers["auth-token-access"]);
      setRefreshToken(res.headers["auth-token-refresh"]);
  }

  useEffect(() => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedRefreshToken && savedUser && savedAccessToken) {
      setRefreshToken(savedRefreshToken);
      setAccessToken(savedAccessToken)
      setUser(JSON.parse(savedUser));
    }
  }, []);
    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!accessToken && (
        <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={onClickHandle}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </form>
      )}
    </div>
  )
}

export default Login