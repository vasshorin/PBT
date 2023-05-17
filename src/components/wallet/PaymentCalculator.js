import React, { useState } from 'react';

const PaymentCalculator = () => {
  // State variables for credit card list and calculator
  const [creditCards, setCreditCards] = useState([]);
  const [creditCardName, setCreditCardName] = useState('');
  const [creditCardBalance, setCreditCardBalance] = useState('');
  const [creditCardLimit, setCreditCardLimit] = useState('');

  // Function to add a new credit card
  const handleAddCreditCard = () => {
    if (creditCardName && creditCardBalance && creditCardLimit) {
      const newCreditCard = {
        name: creditCardName,
        balance: parseFloat(creditCardBalance),
        limit: parseFloat(creditCardLimit),
      };

      setCreditCards([...creditCards, newCreditCard]);
      setCreditCardName('');
      setCreditCardBalance('');
      setCreditCardLimit('');
    }
  };

  // Function to remove a credit card
  const handleRemoveCreditCard = (cardIndex) => {
    const updatedCards = creditCards.filter((_, index) => index !== cardIndex);
    setCreditCards(updatedCards);
  };

  // Function to update a credit card
  const handleUpdateCreditCard = (cardIndex) => {
    const updatedCards = [...creditCards];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      name: creditCardName,
      balance: parseFloat(creditCardBalance),
      limit: parseFloat(creditCardLimit),
    };
    setCreditCards(updatedCards);
    setCreditCardName('');
    setCreditCardBalance('');
    setCreditCardLimit('');
  };

  // Function to calculate credit card payment
  const calculatePayment = (balance, interestRate, monthlyPayment) => {
    const monthlyInterestRate = interestRate / 12;
    const monthsRemaining = Math.ceil(balance / monthlyPayment);
    const interestPaid = monthsRemaining * monthlyInterestRate * balance;
    const totalPaid = balance + interestPaid;

    return {
      monthsRemaining,
      interestPaid,
      totalPaid,
    };
  };

  // State variables for credit card payment calculator
  const [paymentBalance, setPaymentBalance] = useState('');
  const [paymentInterestRate, setPaymentInterestRate] = useState('');
  const [paymentMonthlyPayment, setPaymentMonthlyPayment] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  // Function to handle credit card payment calculation
  const handleCalculatePayment = () => {
    if (paymentBalance && paymentInterestRate && paymentMonthlyPayment) {
      const balance = parseFloat(paymentBalance);
      const interestRate = parseFloat(paymentInterestRate) / 100;
      const monthlyPayment = parseFloat(paymentMonthlyPayment);

      const result = calculatePayment(balance, interestRate, monthlyPayment);
      setPaymentResult(result);
    }
  };

  return (
    <>
     <div className="flex flex-col items-center p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
  <div className="w-full md:w-1/2">
    <div className="flex flex-col md:ml-4">
      <h3 className="text-lg font-bold mb-2">Credit Card Payment Calculator</h3>
      <div className="flex flex-col">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="balance">
            Balance
          </label>
          <input
            className="w-full appearance-none border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            id="balance"
            value={paymentBalance}
            onChange={(e) => setPaymentBalance(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="interestRate">
            Interest Rate (%)
          </label>
          <input
            className="w-full appearance-none border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            id="interestRate"
            value={paymentInterestRate}
            onChange={(e) => setPaymentInterestRate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="monthlyPayment">
            Monthly Payment
          </label>
          <input
            className="w-full appearance-none border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            id="monthlyPayment"
            value={paymentMonthlyPayment}
            onChange={(e) => setPaymentMonthlyPayment(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleCalculatePayment}
        >
          Calculate
        </button>
        {paymentResult && (
          <div className="mt-4">
            <h4 className="text-lg font-bold mb-2">Payment Result</h4>
            <p>Months Remaining: {paymentResult.monthsRemaining}</p>
            <p>Interest Paid: ${paymentResult.interestPaid.toFixed(2)}</p>
            <p>Total Paid: ${paymentResult.totalPaid.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default PaymentCalculator;
