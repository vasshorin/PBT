import React from 'react';
import cc from '../../assets/images/creditcards.png';
import expenses from '../../assets/images/expenses.png';
import visuals from '../../assets/images/visuals.png';
import categories from '../../assets/images/categories.png';


const Features = () => {
  return (
    <>
      <div className="flex flex-col -mx-4 items-center space-y-20">
        {/* Expenses */}
        <div className="flex flex-col sm:flex-row px-4 mb-8 items-center gap-10">
          <div className="w-full sm:w-1/2">
            <img src={expenses} alt="Feature 1" className="w-full object-cover object-center" />
          </div>
          <div className="p-6 w-full sm:w-1/2">
              <h2 className="text-xl font-bold mb-2">Tracking expenses</h2>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li className="text-gray-600">Keep a close eye on your expenses by using our powerful tracking tools.</li>
                  <li className="text-gray-600">Easily categorize your expenses, set budgets, and analyze your spending patterns.</li>
                  <li className="text-gray-600">Stay in control of your finances and make informed financial decisions.</li>
                </ul>
              </p>
          </div>
        </div>

        {/* Credit Card */}
        <div className="flex flex-col sm:flex-row px-4 mb-8 items-center gap-10">
          <div className="p-6 w-full sm:w-1/2">
            <h2 className="text-lg font-bold mb-2">Credit Card Health</h2>

                <p className="text-gray-600">
                  <ul className="list-disc list-inside">
                    <li className="text-gray-600">Our credit card health tool allows you to keep track of your credit card usage.</li>
                    <li className="text-gray-600">Know your utilization rate, credit limit, available credit, and more.</li>
                    <li className="text-gray-600">Stay on top of your credit card payments and avoid late fees.</li>
                  </ul>
                </p>
          </div>
          <div className="w-full sm:w-1/2">
            <img src={cc} alt="Feature 2" className="w-full object-cover object-center" />
          </div>
        </div>

        {/* Visual Data */}
        <div className="flex flex-col sm:flex-row px-4 mb-8 items-center gap-10">
          <div className="w-full sm:w-1/2">
            <img src={visuals} alt="Feature 3" className="w-full object-cover object-center" />
          </div>
          <div className="p-6 w-full sm:w-1/2">
            <h2 className="text-lg font-bold mb-2">Visual Representation</h2>
            <p className="text-gray-600">
              <ul className="list-disc list-inside">
                <li className="text-gray-600">Our visual representation tools allow you to see your financial data in a new light.</li>
                <li className="text-gray-600">See your spending in a new, more intuitive way with our pie charts and other tools.</li>
                <li className="text-gray-600">Easily see your spending patterns and make informed financial decisions.</li>
              </ul>
            </p>
          </div>
        </div>

        {/* Categories Expenses */}
        <div className="flex flex-col sm:flex-row px-4 mb-8 items-center gap-10 pb-12">
          <div className="p-6 w-full sm:w-1/2">
            <h2 className="text-lg font-bold mb-2">Categorize Expenses</h2>
            <p className="text-gray-600">
              <ul className="list-disc list-inside">
                <li className="text-gray-600">Easily categorize your expenses to get a better understanding of your spending.</li>
                <li className="text-gray-600">See how much you spend on food, entertainment, and more.</li>
                <li className="text-gray-600">Keep an eye on how much you have left in your budget for each category.</li>
              </ul>
            </p>
          </div>
          <div className="w-full sm:w-1/2">
            <img src={categories} alt="Feature 4" className="w-full object-cover object-center" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
