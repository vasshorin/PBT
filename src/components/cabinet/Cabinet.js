import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cabinet() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      navigate("/login");
    }

    const fetchUser = async () => {
      const response = await axios.get("https://bninja.onrender.com/api/user", {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
      const user = response.data;
      console.log(user);
      setUsername(user.username);
      setEmail(user.email);

      setPassword("********");
    };
    fetchUser();
  }, [navigate]);

  const updateUserName = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      // Redirect to login
      return;
    }

    const response = await axios.put(
      "https://bninja.onrender.com/api/updateUserName",
      {
        username,
      },
      {
        headers: {
          'auth-token-refresh': refreshToken,
        }
      }
    );
    const user = response.data;

    setPassword("********");
  };

  const updateUserPassword = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const response = await axios.put(
      "https://bninja.onrender.com/api/updatePassword",
      {
        password,
      },
      {
        headers: {
          'auth-token-refresh': refreshToken,
        }
      }
    );
    const user = response.data;
    // Hide password from the UI
    setPassword("********");
  };



  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform update logic here
    console.log("Update successful!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Personal Cabinet</h1>
      <p className="mb-4">Update your personal information</p>
      <p className="mb-4">Username: {username}</p>
      <p className="mb-4">Email: {email}</p>
      <p className="mb-4">Password: {password}</p>
      <hr className="my-4" />
      <h2 className="text-xl font-bold mb-4">Update your information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="border border-gray-300 rounded px-4 py-2 w-full"
            value={username}
            onChange={handleUsernameChange}
          />
          <button
            type="button"
            className="bg-custom-blue-color hover:bg-custom-blue-color-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={updateUserName}
          >
            Update Username
          </button>

        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-gray-300 rounded px-4 py-2 w-full"
            value={password}
            onChange={handlePasswordChange}
          />
                    <button
            type="button"
            className="bg-custom-blue-color hover:bg-custom-blue-color-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={updateUserPassword}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default Cabinet;
