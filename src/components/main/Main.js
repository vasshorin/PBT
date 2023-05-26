import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Main = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    e.preventDefault();
    const res = axios.post("https://crabby-plum-getup.cyclic.app/api/register", {
      email: email,
      username: username,
      password: password,

    });
    // redirect to login page
    navigate('/login');

  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-6/12 lg:w-6/12 xl:w-6/12 px-4">
              <div className="pt-32 sm:pt-0">
                <h2 className="font-semibold text-4xl text-gray-800 dark:text-white">
                  A better way to manage money.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  Take control of your finances with our powerful money management tools. Our platform provides a comprehensive solution for budgeting, tracking expenses, and saving money. Say goodbye to financial stress and start achieving your financial goals today.
                </p>
                <div className="mt-12">
                  {/* <Link
                    to="/register"
                    className="bg-custom-blue-color hover:bg-custom-blue-color-dark text-white font-semibold px-6 py-4 rounded shadow"
                  >
                    Get Started
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="w-full md:w-6/12 mt-10 lg:w-6/12 xl:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 dark:bg-gray-700">
                <div className="flex-auto p-5 lg:p-10">
                  <h4 className="text-2xl font-semibold">
                    Sign up for free
                  </h4>
                  <p className="leading-relaxed mt-1 mb-4 text-gray-600 dark:text-gray-300">
                    Experience the benefits of our platform by signing up for a free account today. Get access to powerful financial tools that can help you track your expenses, create budgets, and achieve your financial goals. Join our community of smart money managers and take control of your finances.
                  </p>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="username"
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        placeholder="Full Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          id="customCheckLogin"
                          type="checkbox"
                          className="form-checkbox text-blue-500 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                          checked={agreed}
                          onChange={() => setAgreed(!agreed)}
                          required
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                          I agree with the{' '}
                          <Link
                            to="/privacy"
                            className="text-blue-500 dark:text-blue-300"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        type="submit"
                        className="bg-custom-blue-color hover:bg-custom-blue-color-dark text-white active:bg-custom-blue-color-dark font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap -mx-4">
            {/* Card 1 */}
            <div className="md:w-1/3 px-4 mb-8">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/4386327/pexels-photo-4386327.jpeg"
                  alt="Feature 1"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-2">Tracking expenses</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Keep a close eye on your expenses by using our powerful tracking tools. Easily categorize your expenses, set budgets, and analyze your spending patterns. Stay in control of your finances and make informed financial decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="md:w-1/3 px-4 mb-8">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Feature 2"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-2">Payment calculator</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Easily calculate your payments with our payment calculator. Whether you're planning to make a big purchase or considering a loan, our calculator helps you estimate your monthly payments, interest rates, and repayment schedules.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="md:w-1/3 px-4 mb-8">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/7054417/pexels-photo-7054417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Feature 3"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-2">Budget settings</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Take control of your personal finances and empower yourself with the ability to create and effectively manage budgets. With our intuitive platform, you can easily establish spending limits for various categories and diligently monitor your progress. Our comprehensive budget management feature ensures that you remain on track and successfully attain your financial objectives.
                  </p>
                </div>
              </div>
            </div>
            <section className="bg-gray-50 dark:bg-gray-900">

              <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Pricing Plans
                  </h2>
                  <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                    Choose a plan that works for you.
                  </p>
                </div>
                <div className="mt-16 lg:flex lg:justify-center">
                  <div className="max-w-xs bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mx-auto lg:mx-0">
                    <div className="px-6 py-4">
                      <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white">
                        Basic
                      </h3>
                      <div className="flex items-center justify-center mt-4">
                        <span className="px-2 py-1 uppercase font-semibold text-xs text-gray-900 dark:text-white">
                          $0
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                      </div>
                    </div>
                    <ul className="px-6 py-4">
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700 dark:text-green-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          10 Accounts
                        </span>
                      </li>
                      <li className="flex items-center mt-4">
                        <div className="rounded-full p-2 fill-current text-green-700 dark:text-green-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          20 Categories
                        </span>
                      </li>
                      <li className="flex items-center mt-4">
                        <div className="rounded-full p-2 fill-current text-green-700 dark:text-green-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          No receipt uploads
                        </span>
                      </li>
                    </ul>
                    <div className="px-6 py-4">

                      <Link
                        to="/register"
                        className=""
                      >
                        <button
                          className="block w-full bg-custom-blue-color hover:bg-custom-blue-color-dark text-white font-semibold rounded-lg px-4 py-3"
                        >
                          Get Started
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="max-w-xs bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mt-8 lg:mt-0 lg:ml-8 mx-auto lg:mx-0">
                    <div className="px-6 py-4">
                      <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white">
                        Premium
                      </h3>
                      <div className="flex items-center justify-center mt-4">
                        <span className="px-2 py-1 uppercase font-semibold text-xs text-gray-900 dark:text-white">
                          $19
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                      </div>
                    </div>
                    <ul className="px-6 py-4">
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700 dark:text-green-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          20 Accounts
                        </span>
                      </li>
                      <li className="flex items-center mt-4">
                        <div className="rounded-full p-2 fill-current text-green-700 dark:text-green-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          Unlimited Categories
                        </span>
                      </li>
                      <li className="flex items-center mt-4">
                        <div className="rounded-full p-2 fill-current text-green-700 dark:text-green-500">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          Receipt Uploads
                        </span>
                      </li>
                    </ul>
                    <div className="px-6 py-4">

                      <Link
                        to="/register"
                        className=""
                      >
                        <button
                          className="block w-full bg-custom-blue-color hover:bg-custom-blue-color-dark text-white font-semibold rounded-lg px-4 py-3"
                        >
                          Get Started
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Frequently Asked Questions
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Here are some of our FAQs. If you have any other questions you'd like answered please feel free to email us.
                      </p>
                    </div>
                    <div className="flex items-center mt-6 lg:mt-0">
                    <Link
                        to="/contact"
                        className=""
                      >
                          <button className="block w-full bg-custom-blue-color  hover:bg-custom-blue-color-dark text-white font-semibold rounded-lg px-4 py-3">
                        Contact Us
                      </button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row mt-8">
                    <div className="flex flex-col w-full lg:w-1/2">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-indigo-500 dark:text-indigo-400">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-gray-800 dark:text-white font-semibold ml-2">
                          What is a credit score?
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        A credit score is a number between 300 and 850 that represents your credit risk, or the likelihood you'll pay back what you owe.
                      </p>
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2 mt-6 lg:mt-0 lg:ml-8">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-indigo-500 dark:text-indigo-400">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-gray-800 dark:text-white font-semibold ml-2">
                          How do you improve your credit score?
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        The best way to improve your credit score is to pay your bills on time. You can also get a secured credit card, which is designed for people trying to build credit and is usually easier to get than a regular credit card.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row mt-8">
                    <div className="flex flex-col w-full lg:w-1/2">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-indigo-500 dark:text-indigo-400">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-gray-800 dark:text-white font-semibold ml-2">
                          How do you get a free credit report?
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        You can get a free copy of your credit report once a year from each of the three credit bureaus by visiting AnnualCreditReport.com.
                      </p>
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2 mt-6 lg:mt-0 lg:ml-8">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-indigo-500 dark:text-indigo-400">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <span className="text-gray-800 dark:text-white font-semibold ml-2">
                          What is considered a good credit score?
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        A good credit score is typically anything above 670. The higher your score, the easier it is to get approved for loans and other financial products.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800">
                <div className="container mx-auto px-6 py-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Still have questions?
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        We're here to help. If you have any other questions you'd like answered please feel free to email us.
                      </p>
                    </div>
                    <div className="flex items-center mt-6 lg:mt-0">


                      <Link
                        to="/contact"
                        className=""
                      >
                          <button className="block w-full bg-custom-blue-color  hover:bg-custom-blue-color-dark text-white font-semibold rounded-lg px-4 py-3">
                        Contact Us
                      </button>
                      </Link>
                    
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Main