import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
// import logo from '../../assets/images/logo.png'

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

  const onClickHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/login", {
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
        window.location.href = "/expenses";
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
    // <section class="bg-gray-50 dark:bg-gray-900">
    <div class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {!accessToken && (
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="/"
              class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              {/* <img class="w-8 h-8 mr-2" src="" alt="logo"></img> */}
              Personal Budget Tracker
            </a>
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <h3 className={`text-red-500 ${errorFlag ? "" : "hidden"}`}>{error}</h3>
              <form className="space-y-4 md:space-y-6" onSubmit={onClickHandle}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Sign in
                </button>

                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?
                  <Link
                    to="/register"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
