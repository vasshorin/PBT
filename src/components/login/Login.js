import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState({});
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [errorFlag, setErrorFlag] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://bninja.onrender.com/api/login", {
        username: username,
        password: password,
      });

      if (res.status === 200) {
        localStorage.setItem("refreshToken", res.headers["auth-token-refresh"]);
        localStorage.setItem("accessToken", res.headers["auth-token-access"]);
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setAccessToken(res.headers["auth-token-access"]);
        setRefreshToken(res.headers["auth-token-refresh"]);
        setError(null);
        // Redirect to cabinet
        navigate("/wallet");
      } else if (res.status === 401) {
        setError("Invalid username or password");
        setErrorFlag(true);
      } else if (res.status === 402) {
        setError("Invalid password");
        setErrorFlag(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setErrorFlag(true);
    }
  };

  useEffect(() => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    if (savedRefreshToken && savedUser && savedAccessToken) {
      setRefreshToken(savedRefreshToken);
      setAccessToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back!</h1>
          <p className="mt-4 text-gray-500">
            Log in to your account and manage your finances.
          </p>
        </div>
        <form onSubmit={onSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
          {errorFlag && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                id="username"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </p>

            <button
              type="submit"
              className="inline-block rounded-lg bg-custom-blue-color px-5 py-3 text-sm font-medium text-white"
            >
              Log in
            </button>
          </div>
        </form>
      </div>

      <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
        <img
          alt="Welcome"
          src="https://images.pexels.com/photos/5926223/pexels-photo-5926223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

export default Login;
