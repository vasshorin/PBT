import cc from '../../assets/images/credit-card.svg';
import f2 from '../../assets/images/f2.svg';
import f3 from '../../assets/images/f3.svg';
import React from 'react'

const Features = () => {
  return (
    <>
          <div className="flex flex-column -mx-4">
            {/* Card 1 */}
            <div className="md:w-1/3 px-4 mb-8">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img
                src={cc}
                alt="Feature 1"
                className="w-full object-cover object-center"
              />
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-2">Tracking expenses</h2>
                  <p className="text-gray-600">
                    Keep a close eye on your expenses by using our powerful tracking tools. Easily categorize your expenses, set budgets, and analyze your spending patterns. Stay in control of your finances and make informed financial decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="md:w-1/3 px-4 mb-8">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={f2}
                  alt="Feature 2"
                  className="w-full object-cover object-center"
                />
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-2">Payment calculator</h2>
                  <p className="text-gray-600">
                    Easily calculate your payments with our payment calculator. Whether you're planning to make a big purchase or considering a loan, our calculator helps you estimate your monthly payments, interest rates, and repayment schedules.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="md:w-1/3 px-4 mb-8">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={f3}
                  alt="Feature 3"
                  className="w-full object-cover object-center"
                />
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-2">Budget settings</h2>
                  <p className="text-gray-600">
                    Take control of your personal finances and empower yourself with the ability to create and effectively manage budgets. With our intuitive platform, you can easily establish spending limits for various categories and diligently monitor your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
    </>
  )

}

export default Features